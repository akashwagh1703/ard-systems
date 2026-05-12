# Detailed Product Information

**Source document:** `ARD Scope of Work.docx` (Odisha Animal Resources Development / DAH&VS digital initiatives).  
**RFP reference (as cited in source):** OCAC-SEGP-SPD-0076-2024-25111  
**Purpose of this file:** A structured product specification derived from the Scope of Work, suitable for engineering, UX, and stakeholder alignment.  
**Note on coverage:** Plain-text extraction from the Word file begins at **Section 3 – Functional Requirement**. Sections 1–2 of the original RFP (if present) are not reproduced here; consult the source `.docx` for introductory, commercial, or non-functional clauses.

---

## 1. Executive summary

The document defines a **state-wide, cloud-hosted digital platform** for the **Directorate of Animal Husbandry & Veterinary Services (DAH&VS), Odisha**, covering:

| # | Domain | Core promise |
|---|--------|----------------|
| 3.1 | Semen inventory | End-to-end procurement, allocation, distribution, utilization, redistribution, analytics, integrations, grievances |
| 3.2 | Vaccine inventory | Same pattern as semen, plus charges, booster reminders, village allocation by batch |
| 3.3 | Medicine procurement & distribution | Requisitions, CCD/barcode flows, allocation, predictive analytics (L2), farmer profiles |
| 3.4 | Disease diagnosis & surveillance | Sample-to-report traceability, dashboards, Bharat Pashudhan linkage |
| 3.5 | ARD training (VOTI) | Applications, approvals, slots, training database |
| 3.6 | Mobile Veterinary Units (MVUs) | Tour plans, inventory, geotagged visits, manpower/service tracking, Tata Fleet Edge |
| 3.7 | Expenditure monitoring | State Plan fund allocation, monthly expenditure, fund requests, dashboards |
| 3.8 | Monthly farm reports | Animals, productivity, breeding/lactation, infrastructure, fodder, staff, analytics |
| 3.9 | On-call AI service | Farmer booking, technician allocation, semen sync, OTP closure, dashboards |
| 3.10 | Centralised dashboard | Cross-module hub for visualization and monitoring |
| 3.11 | AI features | Bidder obligation for AI/ML for efficiency, automation, decision support |

**Cross-cutting themes:** multi-tier **web portals**, **mobile apps** (including **offline** where specified), **API integrations** (Krushak Odisha, Bharat Pashudhan, GO-SUGAM, vendor systems, Krushi Samrudhi, Tata Fleet Edge, etc.), **role-based access**, **heat maps and reports** (PDF/CSV/Excel), and a **grievance redressal** pattern (24–48 hour resolution target).

---

## 2. Stakeholders and hierarchy (as implied by the document)

Administrative levels referenced across modules:

- **Directorate** (DAH&VS / state)
- **District** (e.g. **CDVO** – Chief District Veterinary Officer)
- **SDVO**
- **Deputy Director of District Veterinary Hospitals**
- **Block** (e.g. **BVO** – Block Veterinary Officer)
- **End user** field staff (**AIT** – AI Technician, MVU team, LAC/VD/MVU for medicine, etc.)
- **Farmers** (portal access for applications/services where specified)
- **VOTI** (training slot allocation)
- **FSB** (Frozen Semen Bank, Cuttack) / **OLRDS** (semen initiatives)
- **OBPI** (vaccine context)
- **Central store** (medicine – Phulnakhara), **DDLs**, **ADRI**

**Geographic scope:** **30 districts**; semen/vaccine narratives include blocks, **LACs**, villages (vaccine), **3200+ LACs**, **500+** hospitals/dispensaries, **150+** MVUs (medicine).

---

## 3. Common technical architecture (recurring pattern)

For most inventory-centric modules the document specifies:

1. **Central database** – cloud-hosted, state-wide inventory / requisition / surveillance / financial / farm data.
2. **Functional modules** – procurement, allocation, distribution, utilization, grievance (and module-specific items).
3. **User portals** – web, tiered access by role.
4. **Mobile application** – block and end-user (or district/end-user where stated); **offline mode** for low connectivity; optional **barcode** scanning.
5. **API layer** – two-way integration with external systems; extensibility.

**Reporting standard (where stated):** downloads in **PDF, CSV, and Excel** (disease module also mentions **Microsoft Excel** explicitly).

**Inventory UX:** **Colour-coded indicators** (e.g. green / yellow / red) for stock health.

**Data discipline:** Many utilization flows require **updates at least every 7 days**; missing weekly updates trigger **reminders** to end users and **flags** at block and district levels.

---

## 4. Module specifications (from Scope of Work)

### 4.1 Semen inventory management (§3.1)

**Context:** State procurement of normal and sex-sorted semen (cattle, buffalo, goat); in-house production; **FSB Cuttack**; distribution **Directorate → CDVO → block → LAC** via **OLRDS**.

**Objectives**

- End-to-end tracking of procurement and distribution (normal & sex-sorted; cattle & goat).
- Live tracking of utilization at district/block level.
- **Redistribution** between districts when shortages occur.
- Integration with **3rd-party semen vendor**, **GO-SUGAM**, **Krushak Odisha**, **Bharat Pashudhan**.
- **Grievance** integration.

**Proposed application components (summary)**

| Area | Requirement highlights |
|------|-------------------------|
| **Semen database** | Integrate procured + production data from vendor DB. Visibility by location, **semen unique code**, type, animal/bull-buck details, allocated/delivered quantities, delivery date, procurement source (central), production date (in-house). View stock at level above. Colour coding. |
| **Allocation** | State → **30 districts**; map semen to districts via **unique semen code**. |
| **Utilization** | Portal + mobile at end user (**BVO, AIT**); farmers can apply for semen via portal. Fetch farmer via **mobile/Aadhaar** (Krushak Odisha) or manual entry if not registered; **cattle tag** for Bharat Pashudhan. **Unique internal farmer ID** for journey tracking. Capture: farmer id, semen code (dropdown), animal breed, bull ID, collection date, collection batch, damp seal, station number, date administered, distribution source (dropdown). **7-day** update rule and escalation. Auto-deduct from state/district/block/end-user inventory. |
| **Restocking** | “Raise Restocking Request”: animal type, semen type, quantity, urgency (urgent / not urgent). Workflow: end user → block (approve/reject/edit) → district (edit/reject/approve, optional forward to Directorate) → Directorate (edit/accept/reject; inter-district reassignment or add to procurement list; empanelled vendor dropdown; close as **Fulfilled**). **Stock history**; summary pending/approved/fulfilled + **average time to approval** per level. |
| **Redistribution** | Surplus district to deficit; quantity as **number or %** (converted from inventory). **Pickup slot(s)** (single or multiple). |
| **Analytics** | **Dose utilization report** vs target (numbers + %); **heatmap** (red/yellow/green); levels: state, district, block, end user; filters: semen type, animal type, date; optional **breedable population** column. **Dose restocking need report** (heatmap: urgent vs none). **Data updation rate** report. **Master report** (semen-wise utilization + farmer + demographic + dose + timestamps). Exports: PDF, CSV, Excel. |
| **Integrations** | **Krushak Odisha**: Aadhaar/phone; **KO edits** with block+district approval to sync back. **Bharat Pashudhan**: tag / Aadhaar / phone. **GO-SUGAM**: on-call AI service linkage. **Krushi Samrudhi**: call centre – data exchange, logging, redressal. **Vendor procurement system**: fetch procured dose details. Farmer data viewable in app/portal. |
| **Grievance** | Fields: name, user type, issue type (technical/non-technical), service type (semen/vaccine/medicine etc.), description, optional **geo-tagged photo**. Resolution **24–48 hours**. |

---

### 4.2 Vaccine inventory management (§3.2)

**Context:** **OBPI**; vaccination for cattle, poultry, other livestock; district-wide utilization.

**Objectives** – Align with semen: end-to-end procurement/distribution tracking, live utilization, redistribution, integration (vendor, Krushak Odisha, Bharat Pashudhan), grievances.

**Design** – Same five-layer pattern (central DB, modules, portals, mobile+offline+optional barcode, APIs).

**Proposed application components (summary)**

| Area | Requirement highlights |
|------|-------------------------|
| **Vaccine database** | Vendor + production integration. Visibility: location, **batch number**, vaccine type, disease type, animal type, quantity allocated, date delivered; level above visible; colour coding. |
| **Allocation** | State → 30 districts; map by **batch number**; further allotment to **villages** by batch. |
| **Utilization** | Same login/farmer identification pattern as semen (Krushak Odisha / manual). Fields: farmer, batch (dropdown), **expiry date**, vaccine name (dropdown), **quantity administered**, distribution source (dropdown), date administered. 7-day rule + reminders + flags. Auto inventory deduction. **User charges** collected and deposited to department. **Reminders** for additional doses/boosters. **Vaccination plan/report** at block and end user for planning drives. |
| **Restocking** | Same workflow structure as semen with vaccine-specific dropdowns (animal, disease, vaccine name, quantity, urgency). |
| **Redistribution** | Same as semen (surplus/deficit, % or number, pickup slots). |
| **Analytics** | Utilization vs target (heatmap); restocking need (heatmap); data updation rate; **user charges report**; master report. PDF/CSV/Excel. |
| **Integrations** | Krushak Odisha (with edit/approval path), Bharat Pashudhan, 3rd-party vaccine vendor system. |
| **Grievance** | Same pattern as semen. |

---

### 4.3 Medicine procurement and distribution (§3.3)

**Context:** Annual state procurement; allocation **Directorate (Phulnakhara) → CDVO → block (BVD) → LACs, VDs, MVUs** (3200+ LACs, 500+ facilities, 150+ MVUs).

**Objectives**

- Statewide medicine inventory always current.
- Simplified **inter-district** changes and **additional procurement** in emergencies.
- End-user usage tracking for temporal analysis.
- Grievance integration.

**Scope buckets:** medicine tracking & procurement; distribution; data analysis; **L2 farmer database**; grievance.

**Medicine administration tracking**

- End users: **LACs, VDs, MVUs**; farmers may request medicine services on portal.
- Capture: farmer name, medicine (dropdown), quantity, date. **Stray animals:** SKU name + animal type.
- **L2:** farmer name from **searchable dropdown** linked to profile; create profile if missing; **farmer profile** history (medicines filterable by date/medicine); profile updates after each entry.
- 7-day update rule + reminders + flags; auto deduction from inventories.

**Inventory visibility**

- By location, medicine name, quantity allocated/delivered, date delivered; parent level stock; colour coding (**healthy/warning/critical**).
- **Notifications** (app ribbon, SMS, email) to end users and parent level on **critical** stock.

**Requisition (“Raise Requisition Request”)**

- Medicine name (dropdown), quantity, **urgency P0–P3** (P0 highest).
- End user → block → district → optional **“medicines procured at district level”** list; district can reassign between blocks; **CCD** scanning updates stock (CCD integration out of scope but system hooks assumed).
- Directorate: edit/accept/reject; inter-district reassignment or vendor procurement list (empanelled vendor dropdown).
- **Requisition history** with transfer SKU-wise or form-wise into current request.
- Summary: pending / approved / fulfilled + average approval time per level.
- End user/block can mark **fulfilled** against SKU via **barcode scan** (or remains unfulfilled).

**Distribution – database updates**

- **Directorate:** central store login; CCD scan inflow/outflow; per SKU quantity; manual SKU dropdown without scan.
- **District:** CCD tracking; **bulk approval** without scan using SKU dropdown + quantity.
- **Block & end user:** mobile barcode; block scans inflow+outflow; end user scans **inflow** only; bulk approval options.
- **Reallocation** between district/block: **both** scan and **bulk data entry** compulsory paths as described.

**Medicine allocation**

- By SKU; number or %; pickup slots; districts may flag stock as **‘extra’** visible at Directorate.

**Data analysis module**

| Theme | Intent | Output (per document) |
|-------|--------|-------------------------|
| Usage trends | Frequency over daily/weekly/monthly | Graphs by district/block/end user |
| Requisition fulfillment | Time submission → fulfillment | Timeline + % unfulfilled |
| Emergency (P0) trends | Frequency of P0 | Heatmap by district; temporal urgency |
| Reallocation efficiency | Reallocation vs new procurement | Bar chart volumes |
| Stock-out tracking | Instances and duration | Medicine, location, duration |
| Usage by category | e.g. antibiotics, anti-parasitics | Frequency by category |
| **Predictive analytics (L2)** | Forecast demand (ARIMA or similar) | Time-series line by category; numerical tables district/block |

**Farmer-level database (L2)**

- Profile: name, **Aadhaar** (unique id), mobile, medicines administered (filterable).
- Link **Krushak Odisha** + **Bharat Pashudhan** via Aadhaar; KO edits with block+district approval.
- **Custom reports** (Directorate → end user): farmer ID block + medicine administration block + inventory usage analysis; PDF/CSV/Excel.

**Grievance** – Same canonical fields and 24–48 hour target.

---

### 4.4 Disease diagnosis & surveillance (§3.4)

**Aims** – Primary: early detection, prevention, containment, eradication, zoonotic identification, human transmission prevention. Secondary: risk assessment, trend monitoring, control evaluation, animal health, trade, public health, biosecurity, R&D data.

**Digitization objectives**

- End-to-end **sample deposit → final report**.
- **Advice** to beneficiaries post-results.
- **Vaccination history** integration from Bharat Pashudhan.

**Design**

- Central surveillance DB (cloud).
- Portals per administrative tier (through end user).
- **Mobile:** district + end user; **offline**; view reports, outcomes, advice.
- APIs: e.g. **Bharat Pashudhan**.

**Components**

| # | Category | Details |
|---|----------|---------|
| 1 | End-user registration | Beneficiary name, address, mobile/Aadhaar, livestock ID if available – for pattern, recurrence, control. |
| 2 | Disease identification | DB of diseases diagnosed across **30 districts** + **ADRI**. |
| 3 | End-user report access | Mobile + portal: farmer uses mobile/Aadhaar + **unique registration number** from sample submission to view reports/advisory. **User charges** for samples recorded. |
| 4 | Analytics | State, district, end user; real-time + **predictive** outbreak/distribution patterns; Excel, PDF, CSV. |
| 5 | Integration | Bharat Pashudhan identifiers; vaccination status context. |
| 6 | Grievance | Same pattern (user types listed include District, SDVO, Block, AITs, Farmers). |

---

### 4.5 Training activities in ARD sector (§3.5) – VOTI

**Objectives**

- Online training programme management + training database.
- Online application to programmes; officer database; **transparent selection**; individual + batch records.

**Design**

- Central DB (cloud).
- Portals: Directorate through **Veterinary Officers** as end users.
- **Mobile:** district + end user – track **approval** and **slot allotment**.

**Components**

| # | Category | Details |
|---|----------|---------|
| 1 | Registration | VAS/AVAS/BVO/DD/ADVO/CDVO/AD apply via web/mobile; name, block/district, designation, etc. |
| 2 | Approval | Cap participants per institution; district/DAH&VS scrutiny; status visible to applicant (approved/rejected/pending). |
| 3 | Slot allocation | Post-approval, **VOTI** batch-wise slots; participant lists **PDF & Excel** download. |
| 4 | Database | Programmes, participants, **exposure visits**; avoid duplication. |
| 5 | Grievance | Standard module. |

---

### 4.6 Mobile Veterinary Units – MVU (§3.6)

**Objectives** – Primary: workforce monitoring, medicine inventory, service utilization, target achievement, livestock health. Secondary: data-driven decisions, surveillance, cost optimization, sustainability/scalability.

**Design** *(document text says “disease surveillance system” – treat as **copy-paste error**; intent is MVU system)*

- Central DB: deployment, utilization, inventory, efficiency.
- Portals: Directorate through **MVU personnel**.
- **Mobile:** MVU staff – services, medicine usage, cases, **route plans**; **offline** data entry.
- **API:** **Tata Fleet Edge** integration.

**Components**

| # | Category | Details |
|---|----------|---------|
| 1 | Advance tour planning | **3-month plan** from **BVO**; **CDVO** accept/reject/suggest changes; compliance focus. |
| 2 | Medicine inventory | Table updated with utilization + stock left; fields: medicine name, **supplied by** (central vs self-purchased), quantity; colour coding; **flag shortage**. |
| 3 | Villages visited | **Offline** capture; village name + **2 geotagged photos** (arrival/departure); extract location/time/date from EXIF/geo; **auto-verify** vs plan; **flag discrepancies**. |
| 4 | Manpower & service tracking | Daily per-village form: attendees, staffing issues, farmers benefitted (M/F/total), treatments, procedures, vaccinations, AI, pathology samples, user charges, deworming, medicines/supplements, **awareness camp topic**, challenges. |
| 5 | Integration | **Tata Fleet Edge** – location history, driver behaviour, misuse prevention. |
| 6 | Analytics | (i) **Tour plan compliance & coverage** (quarterly; visited vs planned; vs target). (ii) **Services by MVU** vs CDVO/BVO targets. (iii) **Manpower** vs guidelines; understaffing. (iv) **Tata Fleet Edge** report. PDF/CSV/Excel. |
| 7 | Grievance | Standard module. |

---

### 4.7 Expenditure monitoring (§3.7)

**Context:** State Plan schemes (e.g. ADRI surveillance, vaccine production & disease control, biomedical waste under LHCS, equipment repair/AMC under SLSI & MO, **MVU** and other schemes).

**Objectives** – Digital tracking of **allocation vs expenditure** per district/scheme; transparency and decision support.

**Design**

- Central financial DB (cloud).
- Portals: Directorate through **Block** (roles listed include SDVO, Deputy Director District Veterinary Hospitals).
- **Mobile:** district + end user – approvals, expenditure updates, reporting.

**Components**

| # | Category | Details |
|---|----------|---------|
| 1 | Fund allocation | State-wide record per district under **MVU and other State Plan schemes**. |
| 2 | Expenditure reporting | District-level entry per scheme; **automated monthly** financial report. |
| 3 | Fund request & approval | Districts raise requests, justify, track status; Directorate review/approve/modify. |
| 4 | Dashboard & analytics | Real-time usage trends, pending approvals, cross-district comparisons; PDF/CSV/Excel. |
| 5 | Grievance | Standard module. |

---

### 4.8 Monthly farm reports (§3.8)

**Objectives** – Replace paper monthly reports for poultry/cattle/etc. with digital capture and analytics for productivity and policy.

**Design**

- Central farm-level DB (cloud).
- Portals: Directorate through block + **farm owners**.
- **Mobile:** farmers + district officials for real-time entry/monitoring.

**Components**

| # | Category | Details |
|---|----------|---------|
| 1 | Animal count & ID | Counts by species; **tattoo number** per animal for history/productivity/health. |
| 2 | Productivity | Monthly **milk/egg** production and sales; automated monthly reports. |
| 3 | Breeding, AI & lactation | AI, pregnancy confirmation, lactation per cow. |
| 4 | Farm infrastructure | Farm type, area, capacity, present strength, production, infrastructure (sheds, feed godowns, vehicles, power), **fodder farms**. |
| 5 | Fodder farm management | Area, fodder types (e.g. maize, hybrid Napier, alfalfa), yield/ha, distribution. |
| 6 | Staff | Sanctioned vs present strength. |
| 7 | Dashboard & analytics | Productivity, fund utilization, pending approvals, workforce; PDF/CSV/Excel. |
| 8 | Grievance | Standard module. |

*Note: Source table header under §3.8.3 incorrectly says “expenditure statements”; content is farm reporting.*

---

### 4.9 On-call artificial insemination (AI) service (§3.9)

**Objectives** – Digital trace **booking → delivery**; timely service; semen traceability; feed central breeding dashboards.

**Design**

- Central DB: bookings, assignment, completion, feedback; **real-time sync** with **semen inventory**.
- Portals: district, **CDVO**, block, backend ops – demand, workload, routes, grievances.
- APIs: Bharat Pashudhan, **GOSUGAM**, semen system, others.
- **Mobile:** dual UI – **farmers** (book + track) and **technicians** (list, route, service entry); technician **offline** capable.
- **Analytic dashboards** – role-wise.

**Components**

| # | Category | Details |
|---|----------|---------|
| 1 | Farmer booking | App/portal/assisted centre/**chatbot**; livestock ID, breed, location, preferred time; validation via Aadhaar/tag. |
| 2 | Technician allocation & routing | Auto-assign by location, availability, prior assignment; geo clustering; **manual override** with justification. |
| 3 | Semen dose sync | Real-time stock at block/district; assign only if semen available nearby. |
| 4 | Service logging & closure | Completion in app: animal ID, semen batch, timestamp, technician ID; **OTP** verification; farmer feedback. |
| 5 | External integrations | Animal records, live tracking APIs. |
| 6 | Dashboards & analytics | Booking–response ratio, AI conversion, stock-out trends, turnaround, technician efficiency, coverage. |
| 7 | Feedback & grievance | AI quality, technician behaviour; complaints **within 48 hours** via **CDVO/BVO** cells. |

---

### 4.10 Centralised dashboard (§3.10)

- Single **interactive** hub covering modules referenced as **5.1–5.9** in the source (numbering may differ from §3.x in the same document).
- Features: trends, dynamic charts/graphs/reports, **filters**, **drill-down**, real-time sync, cross-device access.

---

### 4.11 Provision of AI features (§3.11)

- Bidder must embed **AI-based** components: examples include **predictive analytics**, intelligent processing, automated workflows, **anomaly detection**, UX enhancement.
- Deliverables: technologies, methodology, implementation approach, **measurable benefits**.
- Constraints: standards compliance, **data security & privacy**, scalability.

---

## 5. Canonical grievance specification (recurring)

Where the document repeats the grievance module, it converges on:

- **Resolution SLA:** **24–48 hours** from receipt (on-call AI feedback mentions **48 hours** to CDVO/BVO cells – align product rules per module).
- **Fields:** Name; **User type** (variants by module – may include District, SDVO, Deputy Director District Veterinary Hospitals, Block, AITs, Farmers); **Issue type** (Technical / Non-Technical); **Service type** (Semen, Vaccine, Medicine, etc.); **Issue description**; optional **geo-tagged photo**.

Product implication: one **shared grievance service** with **service-line** and **role** enums, plus module-specific routing matrices.

---

## 6. External systems matrix

| System | Typical use in document |
|--------|-------------------------|
| **Krushak Odisha (KO)** | Farmer lookup; optional data edit with **block + district approval** to write back |
| **Bharat Pashudhan** | Cattle tag / Aadhaar / phone; vaccination history; animal records |
| **GO-SUGAM** | On-call AI linkage |
| **Krushi Samrudhi** | Call centre integration – exchange, logging, redressal |
| **3rd-party semen / vaccine vendors** | Procurement and production data ingestion |
| **Tata Fleet Edge** | MVU vehicle tracking and behaviour analytics |
| **CCD scanning devices** | Medicine stock movements (hardware noted as not in SOW scope) |

---

## 7. Alignment with this repository (ard-systems)

The codebase under `src/components/microservices/` maps logically to the Scope of Work domains:

| SOW section | Product area | Example dashboard folder |
|-------------|--------------|---------------------------|
| §3.1 | Semen | `semen-services/` |
| §3.2 | Vaccine | `vaccine-management/` |
| §3.3 | Medicine | `medicine-management/` |
| §3.4 | Disease surveillance | `disease-surveillance/` |
| §3.5 | Training | `training-management/` |
| §3.6 | MVU | `mvu-management/` |
| §3.7 | Expenditure | `expenditure-monitoring/` |
| §3.8 | Farm reports | `farm-reporting/` |
| §3.9 | On-call AI | `oncall-ai/` |
| §3.10–3.11 | Cross-cutting analytics / AI | `ai-management/` + per-module `AI*Analytics.jsx` |
| Cross-cutting | Grievance | `grievance-system/` |

Use this table for **gap analysis**: any SOW bullet not represented by UI, API contract, or data model in those areas is a **product backlog** candidate.

---

## 8. Product backlog themes (derived)

1. **Identity & master data** – Aadhaar/phone/tag mappings; internal farmer UUID; tattoo IDs for farms; semen unique codes vs vaccine batch numbers vs medicine SKUs.
2. **Workflow engine** – Multi-level approve/reject/edit/forward; SLA timers; “fulfilled” closures; pickup slots; P0–P3 and urgent/non-urgent taxonomies.
3. **Inventory math** – Cascaded deduction on utilization; redistribution and requisition transactions auditable.
4. **Offline-first mobile** – Semen, vaccine, disease, MVU, on-call technician flows.
5. **Reporting** – Heatmaps, time series, master reports, automated monthly financials, MVU compliance quarterly.
6. **L2 capabilities** – Medicine predictive (ARIMA-class), farmer profiles with KO two-step approval, enhanced farmer picker.
7. **Integrations** – Adapter layer for each external system; audit of sync failures.
8. **Security & AI governance** – Address §3.11 and implied privacy for Aadhaar/health data.
9. **Central dashboard** – Unified navigation, drill-down to module metrics.

---

## 9. Document fidelity statement

This markdown **summarizes and structures** the functional content extracted from `ARD Scope of Work.docx`. It does **not** replace legal, procurement, or compliance review of the original RFP. Wording like “document text says disease surveillance system” under MVU flags an **internal inconsistency** in the source; product teams should confirm intent with the issuer.

---

*Generated for engineering and product planning from the same source path as the Scope of Work document.*
