# Detailed Plan: Mock JSON Data Layer, SOW-Aligned Modules & Correction Roadmap

**Purpose:** Guide refactoring so the ARD System runs on **structured mock JSON** today, swaps to **API + DB** later with minimal UI churn, and **closes gaps** between current screens and `detailed-product-information.md` (Scope of Work §3.x).

**Audience:** Product, UX, and engineering leads prioritizing a demo-ready but **document-accurate** mock before backend delivery.

---

## 1. Goals and non-goals

### 1.1 Goals

| ID | Goal |
|----|------|
| G1 | **Single data access pattern** — UI reads/writes through a small abstraction (`getX` / `listX` / `saveX`) backed by JSON now and HTTP later. |
| G2 | **Authoritative mock JSON** — one source of truth per domain under version-controlled files; optional seed scripts to reset state. |
| G3 | **SOW field fidelity** — forms, tables, and reports expose the **same fields and enums** the document specifies (even if persistence is file/localStorage during transition). |
| G4 | **Module completeness** — every §3.1–§3.9 capability has a **named screen or sub-route**; missing pieces are listed and scheduled, not implied by a single dashboard tile. |
| G5 | **Design consistency** — shared patterns for hierarchy (state → district → block → end user), status colours, workflow steps, and “integration pending” placeholders. |

### 1.2 Non-goals (this phase)

- Production hosting, real SSO, or live connections to Krushak Odisha, Bharat Pashudhan, GO-SUGAM, Tata Fleet Edge, or vendor systems (use **mock adapter** stubs with the same function signatures).
- Native mobile binaries; optionally document **PWA/offline** as a later phase (SOW expects mobile — plan acknowledges gap).

---

## 2. Current baseline (brief)

- Data: scattered `useState` initialisers + `src/data/mockData.js`; **no** `fetch`/axios layer.
- Risk: each dashboard encodes its own shape → **painful API migration** and **inconsistent** SOW coverage.
- Structural issues to fix in plan: **duplicate/unused** disease entry (`DiseaseSurveillanceDashboard.jsx` vs routed `DiseaseDashboard.jsx`); **overlapping** naming between `ai-management` and `semen-services` on the main console.

---

## 3. Target architecture: mock today, API tomorrow

### 3.1 Layered model

```
UI (pages / forms / charts)
        ↓
Hooks (useSemenInventory, useGrievances, …) — optional thin wrappers
        ↓
Services (“repositories”)  e.g. src/services/data/semenRepository.js
        ↓
Data provider interface     e.g. src/services/data/provider.js
        ├── MockJsonProvider  (reads/writes JSON + localStorage overlay)
        └── ApiProvider       (future: REST/GraphQL; same methods)
```

**Rules**

- Components **must not** import raw JSON except through repositories or hooks.
- All repository methods return **Promises** (even mock) so UI already uses `async/await` like real APIs.
- **IDs:** use string UUIDs or stable opaque IDs in JSON (`sem_dose_…`, `grv_…`) — never `Date.now()` as the only key in persisted mock flows if you want repeatable demos.

### 3.2 Suggested directory layout

```
src/
  data/
    mocks/                          # static seed JSON (git-tracked)
      master/
        districts.json              # 30 districts + metadata
        blocks.json                 # block → district
        lac-endpoints.json          # LAC / VD / MVU endpoints (medicine context)
        users-roles.json            # extended role matrix (see §4)
        schemes.json                # State Plan schemes (expenditure)
        medicines.json              # SKU master
        vaccines.json               # vaccine/disease master
        semen-catalog.json          # bull/buck, semen type, unique code patterns
      transactions/
        semen-*.json                # split by entity if files grow large
        vaccine-*.json
        ...
    README.md                       # how to reset / merge seeds
  services/
    data/
      provider.js                   # factory: createDataProvider()
      mockJsonProvider.js
      apiProvider.js                # stub throws "not configured" until wired
      repositories/
        semenRepository.js
        vaccineRepository.js
        medicineRepository.js
        diseaseRepository.js
        trainingRepository.js
        mvuRepository.js
        expenditureRepository.js
        farmReportingRepository.js
        onCallAiRepository.js
        grievanceRepository.js
        integrationAdapters/
          krushakOdisha.mock.js
          bharatPashudhan.mock.js
          goSugam.mock.js
          tataFleet.mock.js
          vendorSemen.mock.js
          vendorVaccine.mock.js
```

**localStorage strategy (optional):** Mock provider loads **seed** from `mocks/`, then merges **overlay** from `localStorage` key `ard_mock_overlay_v1` so demos survive refresh without a backend. Provide a **“Reset demo data”** control in admin/settings.

### 3.3 Contract shape (per repository)

Each repository exports a stable surface, for example `semenRepository`:

| Method | Purpose |
|--------|---------|
| `listInventory(filters)` | Cascaded visibility by level, colour status |
| `listAllocations()` | State → district mapping with unique semen codes |
| `createUtilization(payload)` | Farmer-linked dose use; triggers inventory deduction in mock |
| `listRestockRequests(filters)` | Pipeline by status and level |
| `createRestockRequest` / `updateRestockRequest` | Approve/reject/edit transitions |
| `createRedistribution` | Surplus/deficit; qty or %; pickup slots |
| `listReports(reportId, filters)` | Utilization heatmap data, master rows, etc. |

**API migration:** Implement the same methods in `apiProvider` delegating to HTTP; swap factory env `VITE_DATA_PROVIDER=api`.

---

## 4. Roles, hierarchy, and RBAC (mock extension)

The SOW names many actor types; the app currently uses four officer roles + farmer.

**Plan:** extend `users-roles.json` (and `AuthContext` / `ProtectedRoute`) with **document-accurate** labels while keeping implementation manageable:

| Role key (technical) | SOW label (display) | Typical module access |
|---------------------|---------------------|------------------------|
| `directorate` | DAH&VS / Directorate | All approvals, redistribution, procurement lists |
| `district_officer` | CDVO (existing) | District scope; forward to directorate |
| `sdvo` | SDVO | Scoped district operations where SOW applies |
| `dd_dvh` | Deputy Director, District Veterinary Hospitals | As per SOW portals |
| `block_officer` | BVO (existing) | Block approvals, MVU plan submission |
| `field_user` | AIT / MVU staff / end user | Utilization, scans (simulated), MVU daily form |
| `voti_admin` | VOTI | Slot allocation only (training) |
| `farmer` | Farmer | Applications, bookings, farm portal |

**Mock phase:** map multiple SOW roles onto the same route guard where screens are not yet split; **document** the mapping in JSON (`roleCapabilities.json`) so you split UI later without renaming data.

---

## 5. Canonical grievance model (all modules)

Replace ad-hoc grievance fields with one **shared** payload (mock + future API):

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `reporterName` | string | yes | |
| `userType` | enum | yes | District, SDVO, DD DVH, Block, AITs, Farmers, MVU, … |
| `issueType` | enum | yes | Technical, Non-Technical |
| `serviceType` | enum | yes | Semen, Vaccine, Medicine, Disease diagnosis, Training, MVU, Expenditure, Farm report, On-call AI, Other |
| `description` | text | yes | |
| `geoTaggedPhoto` | object \| null | no | `{ url, lat, lng, capturedAt }` — mock uses placeholder image URL |
| `status` | enum | system | open, in_progress, resolved |
| `slaDueAt` | ISO datetime | system | createdAt + 24h or 48h per policy |
| `assignedQueue` | string | system | e.g. `technical_team` |

**UI:** `GrievanceDashboard` becomes a **consumer** of `grievanceRepository` + shared form component; service-specific modules link “File grievance” with `serviceType` pre-filled.

---

## 6. Integration adapters (mock-only, stable signatures)

Create **mock adapters** whose interfaces match future real clients:

| Adapter | Methods (example) | Mock behaviour |
|---------|-------------------|----------------|
| `krushakOdisha` | `lookupFarmer({ aadhaar \| phone })`, `proposeKoEdit(payload)` | Return fixed JSON profiles; edit queue stored in mock JSON |
| `bharatPashudhan` | `lookupCattle({ tag \| aadhaar \| phone })` | Return animal + owner stub |
| `goSugam` | `linkOnCallCase(ref)` | No-op success |
| `krushiSamrudhi` | `logCall(record)` | Append to `calls.json` |
| `vendorSemen` / `vendorVaccine` | `syncProcurementSince(date)` | Return batch rows matching your semen/vaccine masters |
| `tataFleet` | `getVehicleTrail(mvuId, range)` | Return polyline-ready points stub |

UI modules call adapters **only** through `integrationService` façade (refactor existing simulator file or split: **gov generic** vs **ARD SOW**).

---

## 7. Module-by-module gap analysis and planned inner functionality

Legend: **P0** = must have for SOW-accurate mock, **P1** = high value, **P2** = nice / L2.

### 7.1 Semen inventory (§3.1) — `semen-services` (+ clarify relationship to `ai-management`)

| Item | Status (typical) | Planned correction |
|------|------------------|---------------------|
| Unique semen code, type, animal, allocated/delivered, dates, source | Partial (batch-style) | **P0:** master `semen-doses.json`; list views filter by location level; parent-level visibility row |
| Utilization form (farmer KO/BP lookup, manual, dose fields) | Missing / simplified | **P0:** dedicated **Utilization** tab + form fields per document: farmer name, phone/Aadhaar, semen unique code (dropdown from inventory at user level), animal breed, bull ID, date of collection, batch of collection, damp seal, station number, date administered, distribution source (dropdown) |
| Internal farmer journey ID | Missing | **P0:** generate `farmerInternalId` on first create in mock repository |
| 7-day update rule, reminders, flags | Missing | **P1:** `lastUtilizationRecordedAt` per end user; dashboard badges + mock “reminder” list |
| Restock workflow (end user → block → district → directorate) | Missing | **P0:** statuses + transitions; fields: animal type, semen type, quantity, urgency; history + avg time mock metrics |
| Redistribution (qty or %, pickup slots) | Missing | **P0:** form + transaction entity `semen-redistributions.json` |
| Reports: dose utilization heatmap, restocking need, updation rate, master | Partial | **P0:** data-driven charts reading same JSON aggregates; export buttons call `exportCsv` / stub PDF |
| Integrations | Not SOW-specific | **P1:** wire utilization “lookup” buttons to mock adapters |

**Design:** Rename or cross-link main dashboard tiles so **“AI Management”** vs **“Semen Services”** matches SOW language (single logical “Semen inventory”; AI as analytics child).

---

### 7.2 Vaccine inventory (§3.2) — `vaccine-management`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Batch-level visibility + disease + animal type | Partial | **P0:** extend inventory rows to match SOW columns |
| Village allocation by batch | Missing | **P0:** `vaccine-village-allocation.json` + UI under Distribution |
| Utilization form | Missing | **P0:** tab mirroring semen pattern: batch dropdown, expiry, vaccine name, qty administered, source, date; optional farmer linkage |
| User charges + booster reminders + vaccination plan | Missing | **P1:** separate subtabs; mock cron list |
| Restock / redistribution | Missing | **P0:** parallel structure to semen repositories |
| User charges report | Missing | **P1:** report query on utilization mock |

---

### 7.3 Medicine (§3.3) — `medicine-management`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Administration: stray animal path | Missing | **P0:** toggle “Farmer / Stray”; stray → SKU + animal type only |
| L2 farmer profile (searchable, history) | Missing | **P2:** `farmers-medicine.json` + profile drawer |
| Requisition P0–P3, multi-level, fulfilled by scan (simulated) | Partial | **P0:** align priority enum; add **workflow steps** + `districtProcuredList` flag |
| Distribution inflow/outflow by level | Missing | **P0:** tabbed “Central / District / Block / End user” with scan **simulation** buttons recording events |
| Reallocation (scan + bulk) | Missing | **P0:** two paths generating `stock-movements.json` |
| District “extra stock” flag | Missing | **P0:** boolean on district stock row |
| Analytics set (usage, fulfillment, P0 heatmap, stock-out, category, ARIMA placeholder) | Partial | **P1:** feed charts from aggregated JSON |
| Notifications (critical stock) | Missing | **P2:** mock `notifications.json` + ribbon component in shell |

---

### 7.4 Disease surveillance (§3.4) — `disease-surveillance`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Single routed dashboard | Split brain (`DiseaseSurveillanceDashboard` unused) | **P0:** consolidate to **one** dashboard component or route nested tabs; delete or merge duplicate |
| Beneficiary registration fields | Missing | **P0:** name, address, mobile/Aadhaar, livestock ID optional → `disease-registrations.json` |
| Disease identification DB | Partial | **P0:** `disease-diagnoses.json` keyed by district + lab |
| Report retrieval (mobile/Aadhaar + **registration number**) | Missing | **P0:** “Track report” tab + mock match |
| User charges for samples | Missing | **P0:** amount + deposit status fields |
| Bharat Pashudhan vaccination context | Missing | **P1:** read-only panel from mock adapter |
| Analytics / predictive copy | Partial | **P1:** clarify labels vs live ML |

---

### 7.5 Training / VOTI (§3.5) — `training-management`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Applicant designations list | Partial | **P0:** enums: VAS, AVAS, BVO, DD, ADVO, CDVO, AD |
| Institution cap + approval | Missing logic | **P0:** rules in JSON (`maxPerInstitution`); state machine pending/approved/rejected |
| VOTI slot batch allocation | Missing | **P0:** `training-batches.json`; assign applicant IDs |
| Participant export PDF/Excel | Missing / stub | **P1:** reuse `ReportCenter` exporters; minimal PDF stub or “download CSV” first |
| Exposure visits | Missing | **P2:** entity in programme record |

---

### 7.6 MVU (§3.6) — `mvu-management`

| Item | Status | Planned correction |
|------|--------|--------------------|
| 3-month tour plan + CDVO approve/reject/suggest | Partial / generic | **P0:** entities `mvu-tour-plans.json` with version history |
| Medicine table (name, supplied by, qty, shortage flag) | Partial | **P0:** exact columns + colour thresholds from JSON config |
| Villages visited + 2 geotagged photos + verify vs plan | Missing | **P0:** form fields + mock EXIF object; **flag** `planMismatch` boolean |
| Daily service form (long field list) | Partial | **P0:** single structured form matching SOW list (attendees, M/F/total, treatments, vaccinations, AI, samples, charges, deworming, medicines, awareness topic, challenges) |
| Tata Fleet Edge report | Stub | **P1:** `tataFleet` adapter drives “Fleet” tab |
| Analytics quartet | Partial | **P0:** queries over mock JSON for compliance %, services vs target, manpower, fleet |

---

### 7.7 Expenditure (§3.7) — `expenditure-monitoring`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Fund allocation per district per **scheme** | Partial | **P0:** `expenditure-allocations.json` (district × scheme × FY) |
| Monthly expenditure entry | Partial | **P0:** normalized `expenditure-lines.json` (month, scheme, district, heads) |
| Automated monthly report | Missing | **P1:** generator reading lines + PDF/CSV stub |
| Fund request + approval | Missing | **P0:** workflow entity + UI |

---

### 7.8 Monthly farm reports (§3.8) — `farm-reporting`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Animal counts + tattoo ID | Partial | **P0:** per-animal records or array on farm |
| Monthly milk/egg + sales | Partial | **P0:** `farm-monthly-production.json` |
| AI, pregnancy, lactation per animal | Missing | **P0:** `farm-breeding-events.json` |
| Infrastructure + fodder + staff | Missing | **P0:** nested objects on `farms.json` |
| Dashboard metrics wired to JSON | Partial | **P0:** all KPIs from repository aggregations |

---

### 7.9 On-call AI (§3.9) — `oncall-ai`

| Item | Status | Planned correction |
|------|--------|--------------------|
| Farmer booking fields (livestock ID, breed, location, time) | Partial | **P0:** align form; validation hooks to mock BP/KO |
| Auto-allocation + override justification | Missing | **P0:** mock algorithm writes `assignedTechnicianId`; override requires `reason` string |
| Semen sync | Missing | **P0:** on assign, check `semenRepository` availability at block/district; show blocking message if none |
| OTP closure | Demo hardcoded | **P0:** store `closureOtp` per request in JSON (random 4-digit seed); still mock but not constant `1234` |
| Dashboard metrics | Partial | **P1:** booking–response ratio, turnaround, stock-out from JSON |

---

### 7.10 Central dashboard + AI (§3.10–§3.11) — `MainDashboard`, `ai-management`

| Item | Planned correction |
|------|--------------------|
| Central dashboard | **P0:** each KPI tile reads from **aggregated read APIs** of repositories (not duplicate literals). |
| AI features | **P1:** separate “AI insights” data in `insights.json` with traceability: `insightType`, `sourceModule`, `generatedAt`; avoid claiming live prediction where data is static. |

---

## 8. Form field specification matrix (authoritative for mock JSON entities)

Use these as column names / JSON keys in v1 mocks.

### 8.1 Semen utilization record

`farmerName`, `farmerPhone`, `farmerAadhaarMasked`, `farmerInternalId`, `semenUniqueCode`, `animalBreed`, `bullId`, `dateOfCollection`, `collectionBatch`, `dampSeal`, `stationNumber`, `dateAdministered`, `distributionSource`, `administeredByUserId`, `locationId`, `createdAt`, `sourceFarmerData` (`KO` \| `MANUAL` \| `BP_TAG`).

### 8.2 Semen restock request

`animalType`, `semenType`, `quantityNeeded`, `urgency` (`URGENT` \| `NORMAL`), `requestedBy`, `currentLevelStatus`, `history` (array of `{ level, action, by, at, note }`).

### 8.3 Semen redistribution

`fromDistrictId`, `toDistrictId`, `quantityOrPercent`, `percentFlag`, `computedQuantity`, `pickupSlots` (array of `{ start, end, location }`), `createdBy`.

### 8.4 Vaccine utilization record

`farmerName`, `farmerPhone`, `farmerAadhaarMasked`, `batchNumber`, `expiryDate`, `vaccineName`, `quantityAdministered`, `distributionSource`, `dateAdministered`, `userChargesAmount`, `userChargesDepositedRef`.

### 8.5 Medicine administration

`mode` (`FARMER` \| `STRAY`), `farmerName` (optional), `medicineSkuId`, `quantity`, `dateAdministered`, `strayAnimalType` (optional), `recordedBy`.

### 8.6 Medicine requisition

`medicineSkuId`, `quantity`, `urgency` (`P0`|`P1`|`P2`|`P3`), `status`, `fulfillmentScanRefs` (array, can be mock strings), `path` (workflow array).

### 8.7 Disease beneficiary registration

`beneficiaryName`, `address`, `mobile`, `aadhaarMasked`, `livestockId`, `registrationNumber` (generated), `registeredAt`, `registeredBy`.

### 8.8 MVU daily village service

`mvuId`, `villageId`, `date`, `attendees`, `staffingIssueNotes`, `farmersBenefittedMale`, `farmersBenefittedFemale`, `farmersBenefittedTotal`, `treatmentsSummary`, `proceduresSummary`, `vaccinationsCount`, `aiCount`, `pathologySamples`, `userChargesCollected`, `dewormingCases`, `medicinesDistributedNotes`, `supplementsDistributedNotes`, `awarenessCampTopic`, `challengesNotes`.

### 8.9 On-call AI booking

`livestockId`, `breed`, `location`, `preferredWindow`, `farmerId`, `status`, `assignedTechnicianId`, `closureOtp`, `completedAt`, `feedbackRating`, `feedbackComment`.

*(Add expenditure and farm entities similarly when implementing those repositories.)*

---

## 9. Phased delivery plan

| Phase | Duration (indicative) | Deliverables |
|-------|----------------------|--------------|
| **Phase 0 — Foundation** | 3–5 days | `provider.js`, `mockJsonProvider`, folder layout, first repository (`grievance` + `districts` master), migrate **one** module end-to-end (grievance) as pattern |
| **Phase 1 — Masters** | 3–5 days | All master JSON + seed load; `AuthContext` extended; capability map JSON |
| **Phase 2 — Semen + Vaccine core** | 1–2 weeks | Inventory, utilization, restock, redistribution, reports from mocks |
| **Phase 3 — Medicine + Disease** | 1–2 weeks | Full forms + stock movements; disease registration + report lookup |
| **Phase 4 — MVU + Training + Expenditure + Farm** | 2 weeks | Long forms and workflows |
| **Phase 5 — On-call AI + integrations façade** | 1 week | Semen sync, OTP per request, adapter stubs |
| **Phase 6 — Central dashboard aggregation + export** | 3–5 days | Wire MainDashboard KPIs; CSV/PDF stubs unified |

Adjust durations for team size; phases can overlap after Phase 0.

---

## 10. Acceptance criteria (“mock-complete” definition)

1. **No business-critical literals** inside large dashboard files for entities that belong in JSON (masters + transactions).
2. Every module in §7 has **tabs or routes** covering **P0** items, or an explicit **“Planned”** banner with ticket reference (avoid silent gaps).
3. Grievance **single** data model shared across modules.
4. Replacing `MockJsonProvider` with `ApiProvider` requires **only** service layer edits + env config for a pilot module (prove with grievance or semen).
5. Field labels in UI **match** government wording in the SOW where possible (tooltip references document section).

---

## 11. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| JSON files grow large | Split by entity; lazy load per route; generate aggregates at “save” time |
| Concurrent edits in demo | Single-writer assumption; optional simple versioning field |
| Over-engineering before API spec | Keep repository methods coarse; version the interface (`v1`) |
| Legal sensitivity of Aadhaar | Store masked + last-4 only in mocks; document handling for production |

---

## 12. Immediate next steps (checklist)

- [ ] Approve folder layout + naming (`src/data/mocks/...`, `src/services/data/...`).
- [ ] Pick **pilot module** (recommend **Grievance** — smallest, teaches pattern).
- [ ] Draft JSON schemas (even as TypeScript JSDoc or JSON Schema files optional) for pilot + semen utilization.
- [ ] Align `MainDashboard` service titles with SOW module names.
- [ ] Ticket: consolidate **Disease** dashboards into one navigation tree.

---

## 13. Detailed phase-by-phase breakdown

This section expands **§9** into **concrete changes**: new files, refactors, JSON assets, UI behaviour, and **exit criteria** per phase. Phases **build on each other**; after Phase 0, later phases can run in parallel across developers if interfaces stay stable.

---

### Phase 0 — Foundation (data provider + pilot module)

**Objective:** Establish the **mock → API swap** pattern and prove it on **one** end-to-end vertical slice (**Grievance**) plus minimal **geography master** data.

#### 13.0.1 What changes (new files)

| Path | Purpose |
|------|---------|
| `src/services/data/provider.js` | `getDataProvider()`, reads `import.meta.env.VITE_DATA_PROVIDER` (`mock` \| `api`, default `mock`). |
| `src/services/data/mockJsonProvider.js` | Loads seed JSON from `import.meta.glob` or static imports; merges `localStorage` key `ard_mock_overlay_v1`; exposes `readCollection`, `writeCollection`, `resetToSeed()`. |
| `src/services/data/apiProvider.js` | Stub: each method throws `ApiNotConfiguredError` or returns empty until backend exists. |
| `src/services/data/repositories/grievanceRepository.js` | `listGrievances(filters)`, `getGrievance(id)`, `createGrievance(payload)`, `updateStatus(id, patch)`, `assign(id, queue)` — all **async**. |
| `src/services/data/repositories/_ids.js` | `generateId(prefix)` for stable opaque IDs. |
| `src/data/mocks/master/districts.json` | List of Odisha districts (start with subset, grow to 30). |
| `src/data/mocks/transactions/grievances.json` | Seed array matching **§5** canonical fields. |
| `src/data/mocks/README.md` | How seeds work, reset instructions, versioning. |
| `src/hooks/useGrievances.js` (optional) | Wraps repository + loading/error state for `GrievanceDashboard`. |

#### 13.0.2 What changes (modified files)

| File | Change |
|------|--------|
| `src/components/microservices/grievance-system/GrievanceDashboard.jsx` | Remove hardcoded `GRIEVANCE_DATA` shape; replace with repository calls; form fields = **§5** (`userType`, `issueType`, `serviceType`, `description`, optional `geoTaggedPhoto` mock URL upload placeholder). |
| `src/data/mockData.js` | **Deprecate** `GRIEVANCE_DATA` for grievances (or re-export seed IDs only); add comment pointing to JSON. |
| `src/components/common/AppShell.jsx` or settings area | Optional **“Reset demo data”** calling `resetToSeed()`. |

#### 13.0.3 Behaviour / design changes

- Grievance list and modals use **SOW enums** (not generic “Service Delay” unless mapped to `issueType`/`serviceType`).
- **SLA:** on create, set `slaDueAt` = `createdAt + 48h` (config constant); show countdown or badge in list.
- **Geo photo:** file input optional; mock stores `{ url: 'blob:...' or placeholder path, lat, lng }` — no real GPS required in browser mock.

#### 13.0.4 Exit criteria (Phase 0 done when)

1. App runs with grievances **loaded from JSON**; create/edit/resolve persists in **localStorage overlay** (or in-memory if you skip overlay in v0).
2. **No** remaining grievance business arrays inlined in `GrievanceDashboard` initial state.
3. `apiProvider` exists and is wired in factory but unused.
4. Short **developer doc** in `README.md` root: env var + how to add a new repository.

#### 13.0.5 Explicitly out of scope for Phase 0

- Refactoring semen/vaccine/medicine dashboards.
- Real HTTP.

---

### Phase 1 — Master data + RBAC alignment

**Objective:** All **reference data** the SOW assumes (districts, blocks, endpoints, schemes, catalogs) lives in **versioned JSON**; roles/capabilities documented for correct route guards and labels.

#### 13.1.1 What changes (new JSON)

| File | Contents |
|------|----------|
| `master/blocks.json` | `id`, `name`, `districtId`. |
| `master/lac-endpoints.json` | LAC / VD / MVU identifiers, `blockId`, `type` (`LAC` \| `VD` \| `MVU`). |
| `master/schemes.json` | State Plan scheme codes, names, financial year. |
| `master/medicines.json` | SKU `id`, `name`, `category` (antibiotic, dewormer, …). |
| `master/vaccines.json` | Vaccine name, disease type, default animal types. |
| `master/semen-catalog.json` | Bulls/bucks, `semenUniqueCode` pattern or explicit codes, `semenType`, `animalType`. |
| `master/users-roles.json` | Demo users with extended `role` keys from **§4**. |
| `master/roleCapabilities.json` | Which `role` may `view` / `approve` / `create` per `moduleId`. |
| `master/empanelled-vendors.json` | Vendor id/name for dropdowns (semen/vaccine/medicine procurement). |

#### 13.1.2 What changes (new code)

| Path | Purpose |
|------|---------|
| `src/services/data/repositories/masterDataRepository.js` | `listDistricts`, `listBlocks`, `listSchemes`, … — thin reads over master JSON. |
| `src/contexts/AuthContext.jsx` | Support new role strings; optional `capabilities` array on user from JSON login mapping. |
| `src/components/auth/LoginPage.jsx` | Demo user picker pulls from `users-roles.json` (or static import). |

#### 13.1.3 What changes (modified)

| File | Change |
|------|--------|
| `src/App.jsx` | Extend `roles={...}` arrays to include `directorate`, `sdvo`, `dd_dvh`, `voti_admin` where needed, **or** keep routes loose and enforce **capability** checks inside modules (document choice). |
| `src/components/dashboard/MainDashboard.jsx` | Service card titles: align **“AI Management”** vs **Semen** wording (per **§7.1**); link text references correct SOW module. |

#### 13.1.4 Exit criteria

1. Any new form that needs a district uses **`listDistricts()`** — no hardcoded `['Khordha', …]` in new code (existing files can be migrated in later phases module-by-module).
2. `roleCapabilities.json` drives at least **one** visible UI difference (e.g. hide “Directorate approve” button for `block_officer`).
3. All master files load without duplicate keys; documented in `mocks/README.md`.

---

### Phase 2 — Semen + Vaccine core (inventory, utilization, workflows, reports)

**Objective:** Match **§3.1** and **§3.2** P0 items: cascaded visibility, utilization forms, restock/redistribution, vaccine village allocation, parallel restock for vaccines, reports fed from JSON aggregates.

#### 13.2.1 New repositories + JSON (transactions)

**Semen**

| File | Purpose |
|------|---------|
| `repositories/semenRepository.js` | `listInventory`, `listAllocations`, `createUtilization`, `listRestockRequests`, `transitionRestock`, `createRedistribution`, `getAggregatesForReports`. |
| `transactions/semen-inventory.json` | Rows: `semenUniqueCode`, `semenType`, `animalType`, `bullOrBuckId`, `quantityAtLevel`, `locationId`, `allocatedToChild`, `deliveredQty`, `deliveredAt`, `sourceProcurement`, `productionDate`, `statusColor`. |
| `transactions/semen-utilizations.json` | Records per **§8.1**. |
| `transactions/semen-restock-requests.json` | Per **§8.2** + workflow state. |
| `transactions/semen-redistributions.json` | Per **§8.3**. |

**Vaccine**

| File | Purpose |
|------|---------|
| `repositories/vaccineRepository.js` | Mirror semen where concepts align + `listVillageAllocations`, `createVaccineUtilization`, restock/redistribution. |
| `transactions/vaccine-inventory.json` | Batch, vaccine type, disease type, animal type, qty, allocated, delivered, expiry, location. |
| `transactions/vaccine-village-allocations.json` | `batchNumber`, `villageId`, `quantity`. |
| `transactions/vaccine-utilizations.json` | Per **§8.4**. |
| `transactions/vaccine-restock-requests.json`, `vaccine-redistributions.json` | Parallel to semen. |

#### 13.2.2 UI changes — `SemenServicesDashboard.jsx`

| Tab / area | Change |
|------------|--------|
| New **Utilization** | Full form **§8.1**; dropdown `semenUniqueCode` filtered by `locationId` + user role; buttons “Lookup KO”, “Lookup BP” call **Phase 5** adapters or stubs if Phase 5 not done — in Phase 2 use `krushakOdisha.mock` placeholder. |
| New **Restock** | List + detail drawer; actions Approve/Reject/Edit per level stored in `history[]`. |
| New **Redistribution** | Form: from/to district, number or %, pickup slots array. |
| **Reports** | Heatmap-style tables/charts from `getAggregatesForReports`; buttons Export CSV (reuse `reportingEngine` or simple CSV util). |
| **Inventory / Distribution** | Read/write via `semenRepository` instead of local `useState` seed arrays. |
| **7-day compliance** (P1) | Optional: banner on Overview if `lastUtilizationRecordedAt` stale. |

#### 13.2.3 UI changes — `VaccineDashboard.jsx` + `BatchTracking.jsx`

| Tab / area | Change |
|------------|--------|
| **Distribution** | Add **Village allocation** sub-view bound to `vaccine-village-allocations.json`. |
| New **Utilization** | Form **§8.4**; link farmer optional. |
| New **Restock / Redistribution** | Same interaction model as semen with vaccine-specific dropdowns. |
| **Procurement** | Rows from `vaccine-inventory.json` + master vaccine list. |

#### 13.2.4 Exit criteria

1. Creating a **utilization** row decreases inventory in mock (same browser session).
2. Restock request moves through **at least** three statuses (e.g. submitted → block approved → district pending) with audit `history` entries.
3. Vaccine **village** row can be added and appears in district drill-down.
4. Semen **reports** section reads only from repository aggregates, not duplicated literals.

---

### Phase 3 — Medicine + Disease

**Objective:** **§3.3** medicine administration, requisitions P0–P3, distribution levels, stock movements, district “extra” flag; **§3.4** beneficiary registration, report tracking, sample charges; consolidate disease routing.

#### 13.3.1 New JSON + repositories

**Medicine**

| File | Purpose |
|------|---------|
| `repositories/medicineRepository.js` | Admin records, requisitions, stock movements, reallocation, analytics getters. |
| `transactions/medicine-administrations.json` | **§8.5**. |
| `transactions/medicine-requisitions.json` | **§8.6** + `districtProcuredList` flag, `fulfillmentScanRefs`. |
| `transactions/medicine-stock-movements.json` | `level`, `direction` (`in`/`out`), `skuId`, `qty`, `method` (`scan` \| `bulk`), `siteId`. |
| `transactions/medicine-district-stock.json` | Includes `flaggedExtraForState`. |

**Disease**

| File | Purpose |
|------|---------|
| `repositories/diseaseRepository.js` | Registrations, lab results, charges, report lookup. |
| `transactions/disease-registrations.json` | **§8.7**. |
| `transactions/disease-lab-results.json` | Links `registrationNumber`, `status`, `reportPdfUrl` (mock string), `advisoryText`. |
| `transactions/disease-sample-charges.json` | Amount, deposit ref, `registrationNumber`. |

#### 13.3.2 UI — `MedicineDashboard.jsx`

| Area | Change |
|------|--------|
| **Administration** | Mode toggle Farmer / Stray; stray fields; save to `medicine-administrations.json`. |
| **Requisition** | Urgency **P0–P3**; multi-step status; “mark fulfilled” with mock scan ref input. |
| **Distribution** | Tabs: Central store / District / Block / End user — each appends **stock movements** (scan simulation button + bulk SKU + qty). |
| **Reallocation** | Two explicit actions: “Record scan movement” and “Bulk entry” both required UX paths per SOW. |
| **District stock** | Checkbox or toggle “Flag as extra (visible at Directorate)”. |
| **Analytics** | Charts read movement + req data (P1 depth acceptable post-P0 forms). |

#### 13.3.3 UI — Disease

| Change | Detail |
|--------|--------|
| **Routing** | Either delete `DiseaseSurveillanceDashboard.jsx` after merging its good parts into `DiseaseDashboard.jsx`, or make `App.jsx` route nested `DiseaseDashboard` wrapping tabs from both — **one** user-facing tree. |
| **Registration tab** | Full **§8.7** form; show generated `registrationNumber`. |
| **Track report tab** | Inputs: mobile or Aadhaar last 4 + registration number; display mock lab result + advisory. |
| **Charges** | Form linked to registration. |

#### 13.3.4 Exit criteria

1. Medicine requisition carries **P0–P3** and persists.
2. At least one **stock movement** recorded per level tab (mock).
3. Disease **registration → lookup → result** works on mock data without page reload losing data (overlay).
4. No second orphaned disease dashboard component in navigation.

---

### Phase 4 — MVU + Training + Expenditure + Farm

**Objective:** Large **operational** forms and workflows for **§3.5–§3.8**.

#### 13.4.1 MVU (`mvu-management`)

| New / changed | Detail |
|---------------|--------|
| `repositories/mvuRepository.js` | Tour plans, approvals, inventory rows, village visits, daily service forms, fleet snapshot reads. |
| `transactions/mvu-tour-plans.json` | 3-month horizon, `submittedByBvo`, `cdvoStatus` (`accepted`/`rejected`/`changesRequested`), `cdvoComment`, versions. |
| `transactions/mvu-medicine-stock.json` | Columns: medicine name, suppliedBy, qty, shortageFlag, colour. |
| `transactions/mvu-village-visits.json` | Village, planned vs actual, two photo metadata objects, `planMismatch`. |
| `transactions/mvu-daily-services.json` | Full **§8.8** field set. |
| `MVUDashboard.jsx` | Tabs: Tour plan, Medicine table, Villages visited, Daily service form, Analytics (compliance, services vs target, manpower, fleet stub). |

#### 13.4.2 Training (`training-management`)

| New / changed | Detail |
|---------------|--------|
| `repositories/trainingRepository.js` | Programmes, applications, approvals, batches, slots. |
| `transactions/training-programmes.json`, `training-applications.json`, `training-batches.json` | Institution key for cap rule; VOTI assigns `batchId`. |
| `TrainingDashboard.jsx` | Application form with designation enum; approval queue; VOTI slot grid; CSV export of participants (PDF stub P1). |

#### 13.4.3 Expenditure (`expenditure-monitoring`)

| New / changed | Detail |
|---------------|--------|
| `repositories/expenditureRepository.js` | Allocations, monthly lines, fund requests, approvals, dashboard aggregates. |
| `transactions/expenditure-allocations.json`, `expenditure-lines.json`, `fund-requests.json` | District × scheme × month. |
| `ExpenditureDashboard.jsx` | Data entry forms + “Generate monthly report” mock (CSV first). |

#### 13.4.4 Farm reporting (`farm-reporting`)

| New / changed | Detail |
|---------------|--------|
| `repositories/farmReportingRepository.js` | Farms, animals, monthly production, breeding events. |
| `transactions/farms.json` | Infrastructure, fodder, staff nested objects. |
| `transactions/farm-animals.json` | Species, tattoo id, farmId. |
| `transactions/farm-monthly-production.json`, `farm-breeding-events.json` | Per **§7.8**. |
| `FarmReportingDashboard.jsx` | Sub-forms per SOW component; KPIs from repo. |

#### 13.4.5 Exit criteria

1. MVU daily service form can be saved and reloaded from mock store.
2. Training application respects **max per institution** from JSON config.
3. Expenditure fund request has **directorate approve/modify** mock transition.
4. Farm module supports **tattoo** + **monthly production** row per farm per month.

---

### Phase 5 — On-call AI + integration façade

**Objective:** **§3.9** booking/assignment/closure with **semen availability check**; centralize **SOW-named** mocks in adapters; stop hardcoded OTP.

#### 13.5.1 New / changed files

| Path | Purpose |
|------|---------|
| `repositories/onCallAiRepository.js` | Bookings, technicians, assignment, OTP, feedback. |
| `transactions/oncall-bookings.json` | **§8.9**; `closureOtp` generated per booking (store masked in list if needed). |
| `integrationAdapters/*.mock.js` | Implement **§6** method signatures. |
| Refactor `src/services/integrationService.js` | Split: keep generic simulators OR move to `integrationAdapters/legacy.mock.js`; add **SOW façade** `integrations/sow/index.js` re-exporting ARD-specific mocks. |

#### 13.5.2 UI — `OnCallAIDashboard.jsx`

| Change | Detail |
|--------|--------|
| Booking form | Add livestock id, breed, preferred window; optional KO/BP lookup buttons. |
| Assignment | Mock auto-assign nearest `field_user` by `districtId`; **Override** requires `justification` string saved on booking. |
| Semen sync | Before confirm assign, `semenRepository.getAvailabilityNear(locationId)` — block assign if zero with user-visible message. |
| OTP | Read expected OTP from booking record (dev panel may show for demo); remove universal `1234`. |

#### 13.5.3 Exit criteria

1. All SOW adapters callable from one façade; no direct random `fetch` to nowhere.
2. On-call flow **fails closed** when semen mock stock insufficient (demonstrates rule).
3. OTP unique per booking in JSON.

---

### Phase 6 — Central dashboard aggregation + unified export

**Objective:** **§3.10** main console KPIs from **live aggregations** of repositories; **§3.11** AI insights as **data-backed** optional feed; consistent export entry points.

#### 13.6.1 New / changed

| File | Change |
|------|--------|
| `src/services/data/aggregateDashboard.js` (or `dashboardRepository.js`) | `getExecutiveKpis()` composes counts from grievance, semen, vaccine, expenditure repos (async `Promise.all`). |
| `MainDashboard.jsx` | Replace static `MAIN_DASHBOARD_DATA` / hardcoded KPIs with loading state + aggregated values; keep chart shells. |
| `transactions/insights.json` (optional) | For AI tiles: `id`, `severity`, `sourceModule`, `title`, `body`, `generatedAt`. |
| `src/components/microservices/ai-management/AIDashboard.jsx` | Read `insights.json` + repo summaries; label clearly **mock / simulated** where appropriate. |
| `reportingEngine.js` or new `exportService.js` | Single `downloadCsv(filename, rows)`, `downloadJson`, stub `downloadPdf(name)` used by all modules. |

#### 13.6.2 Exit criteria

1. At least **five** KPIs on `MainDashboard` are computed from mock repos (e.g. open grievances, pending restocks, low vaccine batches, MVU compliance %, budget utilization %).
2. One **“Export executive summary”** CSV from aggregated data.
3. AI Management dashboard does not contradict aggregated totals (sanity check).

---

### Phase dependency graph (summary)

```
Phase 0 (provider + grievance)
    ↓
Phase 1 (masters + RBAC)
    ↓
Phase 2 (semen + vaccine) ───────┐
    ↓                           │
Phase 3 (medicine + disease)     │
    ↓                           │
Phase 4 (MVU + training + $ + farm)
    ↓                           │
Phase 5 (on-call + adapters) ←──┘  (needs semenRepository from Phase 2)
    ↓
Phase 6 (main dashboard + exports)  (needs Phase 2+ data density; can start partial after Phase 1)
```

---

### Cross-phase recurring tasks (every phase)

- Update **`documents/detailed-product-information.md`** cross-links only if sections change (optional).
- Add **module tab** or **badge** “Mock data” in `ServiceShell` subtitle where absent.
- **Lint:** no unused imports after deletes (disease merge).
- **QA script:** 5-minute walkthrough checklist per phase in `mocks/README.md`.

---

*This plan is the working baseline for “mock JSON first, API later” and for closing SOW gaps. Update it as scopes narrow or as the real API contract is published.*
