# Mock data (Phase 0)

## Storage key

Runtime edits are persisted to **`localStorage`** under:

`ard_mock_overlay_v1`

Bundled **seed** JSON lives under `src/data/mocks/` and is used when no overlay exists or after **Reset demo data**.

## Reset

Use **Reset demo data** in the app header (**super admin** or **directorate**, mock mode only) or clear `localStorage` key `ard_mock_overlay_v1` and reload.

## Switching to API (future)

Set in `.env`:

`VITE_DATA_PROVIDER=api`

Until HTTP clients exist, grievance calls will throw a clear configuration error.

## Files

| Path | Role |
|------|------|
| `master/districts.json` | District dropdown master (30 Odisha districts) |
| `master/blocks.json` | Block / sub-division reference |
| `master/lac-endpoints.json` | LAC / AI station reference |
| `master/schemes.json` | Scheme master |
| `master/medicines.json` | Medicine catalog |
| `master/vaccines.json` | Vaccine catalog |
| `master/semen-catalog.json` | Semen / bull catalog |
| `master/empanelled-vendors.json` | Empanelled vendors |
| `master/roleCapabilities.json` | RBAC capability matrix (`moduleId` + `action`) |
| `master/users-roles.json` | Demo login users (consumed by login + `masterDataRepository`) |
| `transactions/semen-inventory.json` | Semen stock rows (Phase 2) |
| `transactions/semen-utilizations.json` | Semen utilization records |
| `transactions/semen-restock-requests.json` | Semen restock workflow |
| `transactions/semen-redistributions.json` | Semen inter-district redistribution |
| `transactions/vaccine-inventory.json` | Vaccine batch / location stock |
| `transactions/vaccine-village-allocations.json` | Village-level vaccine splits |
| `transactions/vaccine-utilizations.json` | Vaccine utilization records |
| `transactions/vaccine-restock-requests.json` | Vaccine restock workflow |
| `transactions/vaccine-redistributions.json` | Vaccine redistribution |
| `transactions/medicine-administrations.json` | Medicine administration records (§8.5) |
| `transactions/medicine-requisitions.json` | Requisitions with P0-P3 urgency + workflow (§8.6) |
| `transactions/medicine-stock-movements.json` | Movement log by level/direction/method |
| `transactions/medicine-district-stock.json` | District stock + `flaggedExtraForState` |
| `transactions/disease-registrations.json` | Disease sample registrations (§8.7) |
| `transactions/disease-lab-results.json` | Lab result lookup rows + advisory |
| `transactions/disease-sample-charges.json` | Sample charge records |
| `transactions/mvu-tour-plans.json` | MVU tour planning + CDVO review status |
| `transactions/mvu-medicine-stock.json` | MVU medicine inventory rows |
| `transactions/mvu-village-visits.json` | Planned vs actual village visit logs |
| `transactions/mvu-daily-services.json` | MVU daily service form rows (§8.8) |
| `transactions/training-programmes.json` | Training programme config with institution cap |
| `transactions/training-applications.json` | Training applications and approval status |
| `transactions/training-batches.json` | VOTI batch/slot assignment map |
| `transactions/expenditure-allocations.json` | District-scheme yearly allocations |
| `transactions/expenditure-lines.json` | Monthly booked expenditure lines |
| `transactions/fund-requests.json` | Fund request workflow with directorate actions |
| `transactions/farms.json` | Farm master with infrastructure/fodder/staff |
| `transactions/farm-animals.json` | Farm animals with tattoo IDs |
| `transactions/farm-monthly-production.json` | Monthly production rows per farm |
| `transactions/farm-breeding-events.json` | Breeding event records |
| `transactions/oncall-bookings.json` | On-call bookings with per-booking OTP (`closureOtp`) |
| `analytics/grievance-categories.json` | Static analytics buckets for dashboard charts |
