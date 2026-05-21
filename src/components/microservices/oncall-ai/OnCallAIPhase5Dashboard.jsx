import React, { useEffect, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as oncallRepo from '../../../services/data/repositories/onCallAiRepository';
import { getAvailabilityNear } from '../../../services/data/repositories/semenRepository';
import { lookupFarmer, lookupCattle, linkOnCallCase } from '../../../services/integrations/sow';
import { Phone, Users, CheckCircle, Star, Brain } from 'lucide-react';

const COLOR = '#0891B2';
const MODULES = [
  { id: 'dashboard', name: 'Dashboard', icon: Brain },
  { id: 'booking', name: 'Booking', icon: Phone },
  { id: 'assignment', name: 'Assignment', icon: Users },
  { id: 'closure', name: 'OTP Closure', icon: CheckCircle },
  { id: 'feedback', name: 'Feedback', icon: Star },
];

export default function OnCallAIPhase5Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [otpBookingId, setOtpBookingId] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const district = user?.district && user.district !== 'All' ? user.district : '';
  const isOtpDemoVisible = ['super_admin', 'directorate'].includes(user?.role || '');

  const refresh = async () => {
    const [b, t] = await Promise.all([
      oncallRepo.listBookings(district ? { districtId: district } : {}),
      oncallRepo.listTechnicians(district || undefined),
    ]);
    setBookings(b);
    setTechnicians(t);
  };

  useEffect(() => {
    refresh();
  }, []);

  const [bookForm, setBookForm] = useState({
    farmer: '',
    location: district || 'Khordha',
    service: 'Artificial Insemination',
    priority: 'Medium',
    date: '',
    livestockId: '',
    breed: '',
    preferredWindow: '',
    semenLocationId: 'loc_khordha_cdvo',
    justification: '',
  });
  const [assignForm, setAssignForm] = useState({});

  const runKoLookup = async () => {
    const r = await lookupFarmer({ phone: '9876543210' });
    if (r.found && r.profile) {
      setBookForm((p) => ({ ...p, farmer: r.profile.name, location: r.profile.district }));
      toast('KO lookup filled farmer details');
    } else {
      toast('KO lookup not found', 'error');
    }
  };

  const runBpLookup = async () => {
    const r = await lookupCattle({ tag: bookForm.livestockId || 'TAG-001' });
    if (r.found && r.animal) {
      setBookForm((p) => ({ ...p, breed: r.animal.breed, livestockId: r.animal.tagId }));
      toast('BP lookup filled livestock details');
    } else {
      toast('BP lookup not found', 'error');
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    const created = await oncallRepo.createBooking({
      ...bookForm,
      districtId: bookForm.location,
    });
    await linkOnCallCase(created.id);
    toast(`Booking created. OTP (dev): ${created.closureOtp}`);
    setBookForm({ ...bookForm, farmer: '', livestockId: '', breed: '', preferredWindow: '', date: '' });
    refresh();
  };

  const assignBooking = async (booking) => {
    const cfg = assignForm[booking.id] || {};
    const availability = await getAvailabilityNear(booking.semenLocationId || 'loc_khordha_cdvo');
    if (!availability.hasStock) {
      toast('Assignment blocked: no semen stock near selected location', 'error');
      return;
    }
    if (cfg.overrideTechnicianName && !String(cfg.justification || '').trim()) {
      toast('Manual override requires justification', 'error');
      return;
    }
    await oncallRepo.autoAssignTechnician(booking.id, {
      overrideTechnicianName: cfg.overrideTechnicianName || '',
      justification: cfg.justification || '',
    });
    toast(`Assigned. Nearby semen qty: ${availability.totalQty}`);
    refresh();
  };

  const closeWithOtp = async () => {
    if (!otpBookingId || !otpInput) return;
    const res = await oncallRepo.closeBookingWithOtp(otpBookingId, otpInput);
    if (!res.ok) {
      toast('Invalid OTP for selected booking', 'error');
      return;
    }
    toast('Service closed with valid booking OTP');
    setOtpInput('');
    setOtpBookingId('');
    refresh();
  };

  const [feedbackForm, setFeedbackForm] = useState({ bookingId: '', rating: '5', comment: '' });
  const saveFeedback = async (e) => {
    e.preventDefault();
    await oncallRepo.addFeedback(feedbackForm.bookingId, {
      rating: Number(feedbackForm.rating),
      comment: feedbackForm.comment,
      by: user?.name || 'Farmer',
      at: new Date().toISOString(),
    });
    toast('Feedback saved');
    setFeedbackForm({ bookingId: '', rating: '5', comment: '' });
    refresh();
  };

  const render = () => {
    switch (active) {
      case 'booking':
        return (
          <ContentCard>
            <SectionHeader title="On-call booking with livestock details" icon={Phone} color={COLOR} />
            <form onSubmit={submitBooking} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Farmer" required><Input value={bookForm.farmer} onChange={(e) => setBookForm((p) => ({ ...p, farmer: e.target.value }))} /></FormField>
              <FormField label="District"><Input value={bookForm.location} onChange={(e) => setBookForm((p) => ({ ...p, location: e.target.value }))} /></FormField>
              <FormField label="Service"><Select value={bookForm.service} onChange={(e) => setBookForm((p) => ({ ...p, service: e.target.value }))}><option>Artificial Insemination</option><option>Vaccination</option><option>Treatment</option></Select></FormField>
              <FormField label="Priority"><Select value={bookForm.priority} onChange={(e) => setBookForm((p) => ({ ...p, priority: e.target.value }))}><option>High</option><option>Medium</option><option>Low</option></Select></FormField>
              <FormField label="Date"><Input type="date" value={bookForm.date} onChange={(e) => setBookForm((p) => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Preferred window"><Input value={bookForm.preferredWindow} onChange={(e) => setBookForm((p) => ({ ...p, preferredWindow: e.target.value }))} placeholder="08:00-10:00" /></FormField>
              <FormField label="Livestock ID"><Input value={bookForm.livestockId} onChange={(e) => setBookForm((p) => ({ ...p, livestockId: e.target.value }))} /></FormField>
              <FormField label="Breed"><Input value={bookForm.breed} onChange={(e) => setBookForm((p) => ({ ...p, breed: e.target.value }))} /></FormField>
              <FormField label="Semen location ID"><Input value={bookForm.semenLocationId} onChange={(e) => setBookForm((p) => ({ ...p, semenLocationId: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, justifySelf: 'start' }}>Create booking</button>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="btn-outline" style={{ fontSize: 11 }} onClick={runKoLookup}>Lookup KO</button>
                <button type="button" className="btn-outline" style={{ fontSize: 11 }} onClick={runBpLookup}>Lookup BP</button>
              </div>
            </form>
            <SubmittedRecordsTable
              title="Bookings in scope"
              emptyText="No bookings yet. Submit the form above to create one."
              rows={bookings}
              columns={[
                { key: 'id', label: 'Booking ID' },
                { key: 'farmer', label: 'Farmer' },
                { key: 'service', label: 'Service' },
                { key: 'date', label: 'Date', render: (v) => v || '—' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span>,
                },
                { key: 'closureOtpMasked', label: 'OTP' },
              ]}
            />
          </ContentCard>
        );
      case 'assignment':
        return (
          <ContentCard>
            <SectionHeader title="Assignment with semen availability gate" icon={Users} color={COLOR} />
            {bookings.filter((b) => b.status !== 'completed').length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>No open bookings to assign.</p>
            ) : null}
            {bookings.filter((b) => b.status !== 'completed').map((b) => (
              <div key={b.id} style={{ padding: '12px 14px', marginBottom: 10, borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--base-2)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{b.id}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Farmer</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{b.farmer}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned</p>
                    <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.assignedTo || '—'}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginTop: 8, alignItems: 'end' }}>
                  <FormField label="Manual override technician">
                    <Select
                      value={assignForm[b.id]?.overrideTechnicianName || ''}
                      onChange={(e) =>
                        setAssignForm((p) => ({
                          ...p,
                          [b.id]: { ...(p[b.id] || {}), overrideTechnicianName: e.target.value },
                        }))
                      }
                    >
                      <option value="">Auto (nearest in district)</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.name}>{t.name} ({t.districtId})</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Override justification">
                    <Input
                      value={assignForm[b.id]?.justification || ''}
                      onChange={(e) =>
                        setAssignForm((p) => ({
                          ...p,
                          [b.id]: { ...(p[b.id] || {}), justification: e.target.value },
                        }))
                      }
                      placeholder="Required only for manual override"
                    />
                  </FormField>
                  <button className="btn-outline" style={{ fontSize: 10 }} onClick={() => assignBooking(b)}>Assign</button>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8 }}>Technicians in scope: {technicians.map((t) => t.name).join(', ') || 'none'}</p>
          </ContentCard>
        );
      case 'closure':
        return (
          <ContentCard>
            <SectionHeader title="OTP closure (per booking OTP)" icon={CheckCircle} color={COLOR} />
            <FormField label="Booking">
              <Select value={otpBookingId} onChange={(e) => setOtpBookingId(e.target.value)}>
                <option value="">Select booking</option>
                {bookings.filter((b) => b.status !== 'completed').map((b) => <option key={b.id} value={b.id}>{b.id} - {b.farmer}</option>)}
              </Select>
            </FormField>
            <FormField label="OTP">
              <Input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={4} />
            </FormField>
            <button className="btn-blue" style={{ fontSize: 12 }} onClick={closeWithOtp}>Verify & close</button>
            {isOtpDemoVisible && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 'var(--r-lg)', border: '1px solid var(--warning-border)', background: 'var(--warning-bg)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Demo OTP panel (admin/directorate only)</p>
                {bookings.filter((b) => b.status !== 'completed').map((b) => (
                  <p key={b.id} style={{ fontSize: 11 }}>{b.id}: OTP {b.closureOtp} (masked {b.closureOtpMasked})</p>
                ))}
              </div>
            )}
          </ContentCard>
        );
      case 'feedback':
        return (
          <ContentCard>
            <SectionHeader title="Feedback" icon={Star} color={COLOR} />
            <form onSubmit={saveFeedback} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Booking"><Select value={feedbackForm.bookingId} onChange={(e) => setFeedbackForm((p) => ({ ...p, bookingId: e.target.value }))}><option value="">Select</option>{bookings.filter((b) => b.status === 'completed').map((b) => <option key={b.id} value={b.id}>{b.id} - {b.farmer}</option>)}</Select></FormField>
              <FormField label="Rating"><Select value={feedbackForm.rating} onChange={(e) => setFeedbackForm((p) => ({ ...p, rating: e.target.value }))}><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></Select></FormField>
              <FormField label="Comment"><Input value={feedbackForm.comment} onChange={(e) => setFeedbackForm((p) => ({ ...p, comment: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, justifySelf: 'start' }}>Save feedback</button>
            </form>
          </ContentCard>
        );
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Bookings" value={String(bookings.length)} icon={Phone} color={COLOR} />
            <StatCard label="Assigned" value={String(bookings.filter((b) => b.status === 'assigned').length)} icon={Users} color="var(--blue)" />
            <StatCard label="Completed" value={String(bookings.filter((b) => b.status === 'completed').length)} icon={CheckCircle} color="var(--success)" />
            <StatCard label="OTP unique" value="Yes" icon={Star} color="var(--warning)" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="On-Call Veterinary Service" subtitle="Phase 5: SOW adapters, semen-gated assignment, per-booking OTP closure" icon={Phone} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {render()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
