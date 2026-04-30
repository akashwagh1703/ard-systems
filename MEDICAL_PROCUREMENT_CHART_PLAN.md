# Medical Procurement Chart - Implementation Plan

## 📋 Overview
Create a comprehensive Medical Procurement analytics section to track medicine procurement, distribution, stock levels, and consumption patterns across Odisha districts.

---

## 🎯 Objectives

1. **Track Procurement**: Monitor medicine procurement by type, quantity, and cost
2. **Distribution Analysis**: Show district-wise medicine allocation and distribution
3. **Stock Management**: Display current stock levels, consumption rates, and reorder alerts
4. **Trend Analysis**: Visualize procurement trends over time
5. **Category Breakdown**: Show medicine categories (Antibiotics, Vaccines, Supplements, Emergency, etc.)

---

## 📊 Chart Types & Visualizations

### Option 1: Multi-Chart Dashboard (Recommended)
**4 Charts in Grid Layout**

#### Chart 1: Monthly Procurement Trend (Line Chart)
- **X-Axis**: Months (Last 12 months)
- **Y-Axis**: Procurement quantity/value
- **Lines**: 
  - Total Medicines Procured (Purple #7C3AED)
  - Procurement Cost (Orange #F97316)
  - Average per District (Blue #2563EB)
- **Features**: Date range selector (3M, 6M, 12M), tooltips, CSV export

#### Chart 2: Medicine Category Distribution (Donut/Pie Chart)
- **Categories**:
  - Antibiotics (35%)
  - Vaccines (25%)
  - Supplements (20%)
  - Emergency Medicines (10%)
  - Others (10%)
- **Colors**: Different shades of purple/teal
- **Features**: Interactive segments, percentage display, total count in center

#### Chart 3: District-wise Stock Levels (Horizontal Bar Chart)
- **X-Axis**: Stock quantity
- **Y-Axis**: Districts (Top 10 / All 30 toggle)
- **Color Coding**:
  - Green: Adequate stock (>70%)
  - Yellow: Low stock (40-70%)
  - Red: Critical stock (<40%)
- **Features**: Stock status indicators, toggle view, CSV export

#### Chart 4: Procurement vs Consumption (Stacked Bar Chart)
- **X-Axis**: Last 6 months
- **Y-Axis**: Quantity
- **Bars**:
  - Procured (Purple)
  - Consumed (Orange)
  - Remaining Stock (Green)
- **Features**: Monthly comparison, tooltips with percentages

---

### Option 2: Single Comprehensive Chart
**Combined Dashboard with Tabs**

- **Tab 1**: Procurement Overview (Line + Bar combo)
- **Tab 2**: Category Analysis (Pie + Table)
- **Tab 3**: District Distribution (Map + Bar)
- **Tab 4**: Stock Alerts (List + Gauge)

---

### Option 3: Simplified Single Chart (Quick Implementation)
**Procurement Trend Line Chart**

- Simple line chart showing monthly procurement
- 3 lines: Medicines, Cost, Districts Covered
- Minimal features, fast to implement

---

## 📐 Recommended Layout

### Layout Structure:
```
┌─────────────────────────────────────────────────────────┐
│  📦 Medical Procurement Analytics                       │
│  Summary Cards (4 cards)                                │
├─────────────────────────────────────────────────────────┤
│  Chart 1: Monthly Trend    │  Chart 2: Category Dist.  │
│  (Line Chart)              │  (Donut Chart)            │
├─────────────────────────────────────────────────────────┤
│  Chart 3: District Stock   │  Chart 4: Procurement vs  │
│  (Horizontal Bar)          │  Consumption (Stacked)    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Structure

### Mock Data Requirements:

```javascript
// Monthly Procurement Data
{
  month: "Jan 2024",
  medicines: 45000,
  cost: 2500000,
  districts: 28,
  categories: {
    antibiotics: 15750,
    vaccines: 11250,
    supplements: 9000,
    emergency: 4500,
    others: 4500
  }
}

// District Stock Data
{
  district: "Khordha",
  currentStock: 8500,
  capacity: 10000,
  stockPercentage: 85,
  status: "adequate", // adequate, low, critical
  lastProcurement: "2024-01-15",
  consumptionRate: 1200 // per month
}

// Category Distribution
{
  category: "Antibiotics",
  quantity: 15750,
  percentage: 35,
  cost: 875000,
  color: "#7C3AED"
}

// Procurement vs Consumption
{
  month: "Jan 2024",
  procured: 45000,
  consumed: 38000,
  remaining: 7000,
  utilizationRate: 84
}
```

---

## 🎨 Design Specifications

### Color Scheme:
- **Primary**: Purple #7C3AED (Medicine theme)
- **Secondary**: Orange #F97316 (Cost/Alert)
- **Success**: Green #22C55E (Adequate stock)
- **Warning**: Yellow #F59E0B (Low stock)
- **Danger**: Red #EF4444 (Critical stock)
- **Neutral**: Gray #64748B

### Summary Cards (4 cards):
1. **Total Medicines Procured**
   - Value: 540,000
   - Icon: Package
   - Color: Purple
   - Trend: +12%

2. **Total Procurement Cost**
   - Value: ₹3.2 Cr
   - Icon: DollarSign
   - Color: Orange
   - Trend: +8%

3. **Districts Covered**
   - Value: 30/30
   - Icon: MapPin
   - Color: Teal
   - Trend: 100%

4. **Stock Status**
   - Value: 85% Adequate
   - Icon: CheckCircle
   - Color: Green
   - Trend: +5%

---

## 🔧 Implementation Phases

### Phase 1: Data Service Setup (15 min)
- Create `medicalProcurementData.js` in `/services/`
- Add mock data functions:
  - `getMonthlyProcurement(months)`
  - `getCategoryDistribution()`
  - `getDistrictStockLevels()`
  - `getProcurementVsConsumption(months)`
  - `getProcurementStats()`
  - `exportToCSV(data, filename)`

### Phase 2: Component Creation (30 min)
- Create `MedicalProcurementCharts.jsx` in `/components/dashboard/`
- Build component structure:
  - Header with title and description
  - Summary statistics cards (4 cards)
  - Chart grid (2x2 layout)
  - Individual chart components
  - Export buttons
  - Toggle buttons (Top 10/All 30)

### Phase 3: Chart Implementation (45 min)
- **Chart 1**: Monthly Procurement Trend (Recharts LineChart)
- **Chart 2**: Category Distribution (Recharts PieChart)
- **Chart 3**: District Stock Levels (Recharts BarChart)
- **Chart 4**: Procurement vs Consumption (Recharts BarChart)
- Add custom tooltips for each chart
- Implement animations (disabled as per user preference)

### Phase 4: Integration (10 min)
- Import component in `ResourceAnalytics.jsx`
- Add as collapsible section (Section 3)
- Update section count in header
- Update footer statistics
- Test refresh functionality

### Phase 5: Testing & Polish (10 min)
- Test all chart interactions
- Verify data accuracy
- Check responsive layout
- Test export functionality
- Verify color consistency

**Total Estimated Time**: ~2 hours

---

## 🎯 Key Features

### Interactive Features:
- ✅ Date range selector (3M, 6M, 12M)
- ✅ Toggle Top 10 / All 30 districts
- ✅ CSV export per chart
- ✅ Custom tooltips with detailed info
- ✅ Color-coded stock status
- ✅ Collapsible section in ResourceAnalytics
- ✅ Manual refresh support
- ✅ No animations (static charts)

### Data Insights:
- ✅ Procurement trends over time
- ✅ Category-wise distribution
- ✅ District-wise stock status
- ✅ Consumption vs procurement gap
- ✅ Cost analysis
- ✅ Stock alerts (low/critical)

---

## 📱 Responsive Considerations

- **Desktop (>1200px)**: 2x2 grid layout
- **Tablet (768-1200px)**: 2x2 grid (smaller charts)
- **Mobile (<768px)**: Single column stack

---

## 🚀 Alternative Quick Implementation

### Simplified Version (30 min total):
**Single Chart: Monthly Procurement Trend**

- Line chart with 2 lines (Medicines, Cost)
- 4 summary cards
- Basic tooltips
- CSV export
- No category breakdown
- No district details

**Use Case**: If time is limited, start with this and expand later

---

## 💡 Recommendations

### Best Approach: **Option 1 - Multi-Chart Dashboard**

**Why?**
1. Comprehensive view of procurement lifecycle
2. Multiple data dimensions (time, category, district, consumption)
3. Actionable insights for decision-making
4. Matches existing chart complexity in dashboard
5. Provides value for different user roles

**Priority Order:**
1. Monthly Procurement Trend (Most important)
2. District Stock Levels (Critical for operations)
3. Category Distribution (Planning insights)
4. Procurement vs Consumption (Efficiency tracking)

---

## 📝 Next Steps

1. **Get User Approval**: Confirm which option to implement
2. **Data Preparation**: Create mock data service
3. **Component Development**: Build chart component
4. **Integration**: Add to ResourceAnalytics
5. **Testing**: Verify all features work
6. **Documentation**: Update completion summary

---

## ❓ Questions for User

1. **Which option do you prefer?**
   - Option 1: Multi-Chart Dashboard (4 charts)
   - Option 2: Tabbed Dashboard
   - Option 3: Single Simple Chart

2. **What's the priority?**
   - Procurement trends over time?
   - District-wise stock status?
   - Category breakdown?
   - All of the above?

3. **Any specific metrics to track?**
   - Expiry tracking?
   - Supplier information?
   - Quality control data?
   - Emergency stock levels?

4. **Integration preference?**
   - Add as Section 3 in ResourceAnalytics?
   - Create separate standalone component?
   - Replace existing section?

---

**Status**: ⏳ AWAITING USER DECISION
**Created**: 2024
**Plan By**: Amazon Q
