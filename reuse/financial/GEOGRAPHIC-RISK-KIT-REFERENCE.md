# Geographic Risk Analysis Kit - Complete Reference

**File**: `geographic-risk-analysis-kit.ts`
**Version**: 2.0.0
**Lines of Code**: 2,041
**Size**: 63 KB
**Framework**: TypeScript + Sequelize ORM

## Overview

Enterprise-grade financial toolkit for comprehensive geographic and jurisdictional risk assessment. Covers country risk scoring, sanctions detection, corruption analysis, money laundering detection, tax haven identification, and cross-border fund flow monitoring.

---

## Architecture Summary

### Core Components
- **8 Sequelize Models** with full type safety
- **40 Public Functions** organized in 8 functional categories
- **Comprehensive Error Handling** with transaction support
- **Production-Ready** code with JSDoc documentation

### Sequelize Models
1. `CountryRiskScore` - Country-level risk assessments
2. `FATFJurisdiction` - FATF compliance tracking
3. `SanctionsCountry` - Sanctions regime monitoring
4. `CorruptionIndex` - Corruption perception indices
5. `MoneyLaunderingIndex` - AML/CFT risk assessment
6. `TaxHaven` - Tax jurisdiction transparency
7. `CrossBorderFlow` - Fund flow tracking
8. `EmergingMarketRisk` - Market volatility analysis
9. `RegionalRiskAssessment` - Regional aggregation
10. `GeographicConcentration` - Portfolio exposure analysis
11. `TradeRouteRisk` - Supply chain risk assessment

---

## Function Categories & Implementations

### 1. Country Risk Scoring (5 Functions)

#### `calculateCountryRiskScore(countryCode, factors, transaction?)`
Calculates comprehensive country risk score using weighted factors:
- Political Stability (25%)
- Economic Outlook (20%)
- Regulatory Environment (25%)
- Corruption Level (20%)
- Conflict Risk (10%)

**Returns**: `{ riskScore: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }`

#### `getCountryRiskProfile(countryCode, transaction?)`
Retrieves current and historical risk profiles with trend analysis.

**Returns**: `{ current, historical, trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING' }`

#### `compareCountryRisks(countryCodes, transaction?)`
Compares risk scores across multiple countries, sorted by risk level.

**Returns**: `Array<{ country, riskScore, riskLevel }>`

#### `identifyHighRiskCountries(threshold, transaction?)`
Identifies all countries exceeding risk threshold for exposure management.

**Returns**: `CountryRiskScoreAttributes[]`

#### `monitorCountryRiskChanges(countryCode, lookbackDays, transaction?)`
Analyzes historical risk trends and volatility patterns.

**Returns**: `{ country, currentRisk, previousRisk, changePercentage, volatility }`

---

### 2. FATF High-Risk Jurisdiction Functions (5 Functions)

#### `identifyFATFGreyList(transaction?)`
Retrieves all FATF grey-listed jurisdictions requiring enhanced scrutiny.

**Returns**: `FATFJurisdictionAttributes[]`

#### `identifyFATFBlackList(transaction?)`
Retrieves all FATF black-listed jurisdictions requiring transaction blocking.

**Returns**: `FATFJurisdictionAttributes[]`

#### `checkFATFCompliance(countryCode, transaction?)`
Verifies FATF compliance status and identifies specific risk factors.

**Returns**: `{ isCompliant: boolean; status: string; riskFactors: string[] }`

#### `trackFATFStatusChanges(countryCode, transaction?)`
Monitors FATF listing status and duration with historical context.

**Returns**: `{ country, currentStatus, dateAdded, dateResolved, daysOnList, riskFactors }`

#### `assessFATFTransactionRisk(sourceCountry, destinationCountry, amount, transaction?)`
Evaluates transaction compliance with FATF requirements.

**Returns**: `{ riskScore: number; riskLevel: string; complianceAlert: boolean }`

---

### 3. Sanctions Detection Functions (5 Functions)

#### `detectSanctionsCountry(countryCode, transaction?)`
Identifies active sanctions regimes affecting a country.

**Returns**: `{ isSanctioned: boolean; sanctions: SanctionsCountryAttributes[]; activeSanctions: number }`

#### `getSanctionsProfile(countryCode, transaction?)`
Provides complete sanctions profile categorized by type and severity.

**Returns**: `{ country, comprehensiveSanctions, sectoralSanctions, targetedSanctions, overallSeverity }`

#### `identifySectoralSanctions(countryCode, sectors, transaction?)`
Maps sanctions to specific industries (ENERGY, FINANCE, DEFENSE, etc.).

**Returns**: `Array<{ sector, isSanctioned, sanctions }>`

#### `monitorSanctionsTimeline(countryCode, transaction?)`
Tracks sanctions expiration and imminent changes.

**Returns**: `{ activeSanctions, expiringSoon, expectedExpiration }`

#### `assessSanctionsCompliance(sourceCountry, destinationCountry, transaction?)`
Determines transaction compliance with sanctions regimes.

**Returns**: `{ complianceStatus, blockedTransaction, requiredReview }`

---

### 4. Corruption Index Integration Functions (5 Functions)

#### `getCorruptionIndex(countryCode, year?, transaction?)`
Retrieves Transparency International Corruption Perception Index (CPI).

**Returns**: `CorruptionIndexAttributes | null`

#### `rankCountriesByCorruption(limit, year?, transaction?)`
Ranks countries by corruption perception for comparative analysis.

**Returns**: `CorruptionIndexAttributes[]`

#### `analyzeCorruptionByRegion(region, transaction?)`
Provides regional corruption analysis with best/worst performers and trends.

**Returns**: `{ region, averageIndex, bestPerforming, worstPerforming, trend }`

#### `correlateCorruptionWithAMLRisk(countryCode, transaction?)`
Analyzes correlation between corruption levels and money laundering risk.

**Returns**: `{ country, corruptionIndex, amlRiskScore, correlationStrength }`

#### `assessCorruptionRisk(sourceCountry, amount, transaction?)`
Evaluates transaction risk based on country corruption levels.

**Returns**: `{ riskScore, riskLevel, requiresScrutiny }`

---

### 5. Money Laundering Index Analysis Functions (5 Functions)

#### `getMoneyLaunderingIndex(countryCode, transaction?)`
Retrieves Money Laundering Index (MLI) with vulnerabilities.

**Returns**: `MoneyLaunderingIndexAttributes | null`

#### `identifyMoneyLaunderingRisks(riskThreshold, transaction?)`
Identifies countries exceeding AML/CFT risk thresholds.

**Returns**: `MoneyLaunderingIndexAttributes[]`

#### `analyzeMoneyLaunderingVulnerabilities(countryCode, transaction?)`
Provides detailed analysis of AML vulnerabilities and mitigation actions.

**Returns**: `{ country, score, riskRating, keyVulnerabilities, mitigationActions }`

#### `monitorMoneyLaunderingTrends(countryCode, transaction?)`
Tracks ML/FT risk trends and assessment recency.

**Returns**: `{ country, currentScore, assessmentDate, riskTrend }`

#### `assessMoneyLaunderingTransactionRisk(sourceCountry, beneficiaryCountry, amount, transaction?)`
Comprehensive ML/FT risk assessment for specific transactions.

**Returns**: `{ mlRiskScore, ftRiskScore, overallRisk, requiresReporting }`

---

### 6. Tax Haven & Offshore Jurisdiction Functions (5 Functions)

#### `identifyTaxHavens(maxTaxRate, transaction?)`
Lists low-tax jurisdictions for beneficial ownership review.

**Returns**: `TaxHavenAttributes[]`

#### `assessOffshoreTransparency(jurisdictionCode, transaction?)`
Evaluates transparency and CRS/FATCA compliance of offshore centers.

**Returns**: `{ jurisdiction, transparencyRating, aeoi, riskLevel, complianceStatus }`

#### `monitorBeneficialOwnershipRisks(transaction?)`
Identifies tax havens with opacity risks requiring enhanced due diligence.

**Returns**: `Array<{ jurisdiction, taxRate, transparency, ownershipRisk }>`

#### `identifyHighRiskOffshoreJurisdictions(riskThreshold, transaction?)`
Prioritizes offshore centers exceeding risk tolerance thresholds.

**Returns**: `TaxHavenAttributes[]`

#### `assessTaxComplianceExposure(portfolio, transaction?)`
Analyzes portfolio exposure to non-compliant tax jurisdictions.

**Returns**: `{ portfolio, exposedToNonCompliant, nonCompliantCount, recommendedActions }`

---

### 7. Cross-Border Fund Flow Tracking Functions (6 Functions)

#### `trackCrossBorderFlows(sourceCountry, destinationCountry, transaction?)`
Historical tracking of fund flows between country pairs.

**Returns**: `CrossBorderFlowAttributes[]`

#### `identifySuspiciousCrossBorderPatterns(lookbackDays, transaction?)`
Flags suspicious patterns in recent cross-border activity.

**Returns**: `CrossBorderFlowAttributes[]`

#### `analyzeFundFlowCorridors(transaction?)`
Identifies high-volume corridors with concentration risk analysis.

**Returns**: `Array<{ corridor, totalVolume, frequency, averageRisk, concentrationFlag }>`

#### `monitorRemittanceFlows(sourceCountry, destinationCountry, transaction?)`
Specialized analysis of remittance corridors for AML risk.

**Returns**: `{ corridor, totalRemittances, frequency, averageAmount, riskAssessment }`

#### `detectStructuringPatterns(sourceCountry, destinationCountry, lookbackDays, transaction?)`
Identifies potential structuring patterns in transaction flows.

**Returns**: `{ corridor, structuringDetected, consistentPattern, averageAmount, flagForReview }`

---

### 8. Geographic Concentration & Regional Risk Functions (6 Functions)

#### `analyzeGeographicConcentration(portfolio, transaction?)`
Portfolio-level geographic concentration analysis with rebalancing recommendations.

**Returns**: `{ portfolio, concentrations, overconcentration, rebalanceRequired, recommendations }`

#### `assessRegionalRiskAggregation(region, transaction?)`
Aggregates country-level risks at regional level.

**Returns**: `RegionalRiskAssessmentAttributes | null`

#### `identifyRegionalContagionRisks(region, transaction?)`
Analyzes cross-regional risk spillover potential.

**Returns**: `{ primaryRegion, contagionRisk, affectedRegions, mitigationMeasures }`

#### `calculateEmergingMarketRisk(countryCode, transaction?)`
Assesses emerging market volatility and credit indicators.

**Returns**: `EmergingMarketRiskAttributes | null`

#### `rankEmergingMarketsByVolatility(limit, transaction?)`
Prioritizes emerging markets by volatility index.

**Returns**: `EmergingMarketRiskAttributes[]`

#### `identifyTradeRouteRisks(originCountry, destinationCountry, transaction?)`
Analyzes supply chain risks for specific trade routes.

**Returns**: `TradeRouteRiskAttributes | null`

#### `assessTradeRouteImpacts(transaction?)`
Identifies trade routes with highest delays and cost impacts.

**Returns**: `Array<{ route, delay, costImpact, riskLevel }>`

---

### 9. Political Stability & Regulatory Environment Functions (2 Functions)

#### `calculatePoliticalStabilityScore(countryCode, factors, transaction?)`
Scores political stability using World Bank indicators:
- Government Effectiveness (20%)
- Regulatory Quality (20%)
- Rule of Law (20%)
- Control of Corruption (15%)
- Political Stability (15%)
- Voice & Accountability (10%)

**Returns**: `{ countryCode, score, stabilityRating }`

#### `scoreRegulatoryEnvironment(countryCode, factors, transaction?)`
Evaluates regulatory effectiveness across AML/CFT framework:
- AML Compliance (25%)
- FATF Recommendations (25%)
- CFT Compliance (25%)
- Transparency Requirements (15%)
- Enforcement Capacity (10%)

**Returns**: `{ countryCode, score, environmentRating }`

---

## Usage Examples

### Example 1: Comprehensive Country Risk Assessment
```typescript
const kit = new GeographicRiskAnalysisKit(sequelize);

// Calculate country risk score
const riskResult = await kit.calculateCountryRiskScore('IRN', {
  politicalStability: 20,
  economicOutlook: 35,
  regulatoryEnvironment: 25,
  corruptionLevel: 80,
  conflictRisk: 90
});

// Get full profile
const profile = await kit.getCountryRiskProfile('IRN');

// Check FATF status
const fatf = await kit.checkFATFCompliance('IRN');

// Check sanctions
const sanctions = await kit.detectSanctionsCountry('IRN');
```

### Example 2: Transaction Risk Assessment
```typescript
// Assess transaction from Iran to UAE
const fatfRisk = await kit.assessFATFTransactionRisk('IRN', 'ARE', 500000);
const sanctionRisk = await kit.assessSanctionsCompliance('IRN', 'ARE');
const mlRisk = await kit.assessMoneyLaunderingTransactionRisk('IRN', 'ARE', 500000);

// Corruption-based assessment
const corruptionRisk = await kit.assessCorruptionRisk('IRN', 500000);
```

### Example 3: Portfolio Geographic Analysis
```typescript
// Analyze portfolio concentration
const concentration = await kit.analyzeGeographicConcentration('PORTFOLIO_A');

// Monitor cross-border flows
const flows = await kit.trackCrossBorderFlows('USA', 'CHN');
const patterns = await kit.detectStructuringPatterns('USA', 'CHN');

// Assess offshore exposure
const taxCompliance = await kit.assessTaxComplianceExposure('PORTFOLIO_A');
```

### Example 4: Regional Risk Monitoring
```typescript
// Assess regional risks
const regionRisk = await kit.assessRegionalRiskAggregation('MIDDLE_EAST');
const contagion = await kit.identifyRegionalContagionRisks('MIDDLE_EAST');

// Monitor emerging markets
const volatility = await kit.rankEmergingMarketsByVolatility(10);
const trade = await kit.assessTradeRouteImpacts();
```

---

## Data Models

### Country Risk Score
```typescript
interface CountryRiskScoreAttributes {
  id: string;
  countryCode: string;           // ISO 3166-1 alpha-3
  countryName: string;
  riskScore: number;             // 0-100
  riskLevel: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL';
  lastUpdated: Date;
  dataSource: string;
}
```

### FATF Jurisdiction
```typescript
interface FATFJurisdictionAttributes {
  id: string;
  countryCode: string;
  jurisdictionName: string;
  fatfStatus: 'GREY_LIST'|'BLACK_LIST'|'COMPLIANT';
  dateAdded: Date;
  dateResolved?: Date;
  riskFactors: string[];
  recommendedActions: string[];
}
```

### Sanctions Country
```typescript
interface SanctionsCountryAttributes {
  id: string;
  countryCode: string;
  sanctionType: string;
  sanctioningBody: string;       // UN, OFAC, EU, etc.
  effectiveDate: Date;
  endDate?: Date;
  severity: 'COMPREHENSIVE'|'TARGETED'|'SECTORAL';
  description: string;
}
```

### Money Laundering Index
```typescript
interface MoneyLaunderingIndexAttributes {
  id: string;
  countryCode: string;
  countryName: string;
  mliScore: number;              // 0-100
  riskRating: 'VERY_HIGH'|'HIGH'|'MODERATE'|'LOW';
  vulnerabilities: string[];
  lastAssessed: Date;
}
```

### Tax Haven
```typescript
interface TaxHavenAttributes {
  id: string;
  jurisdictionCode: string;      // ISO 3166-1 alpha-3
  jurisdictionName: string;
  taxRate: number;               // Effective tax rate %
  transparency: 'HIGH'|'MEDIUM'|'LOW';
  aeoi: boolean;                 // Automatic Exchange of Information
  riskLevel: number;             // 0-100
}
```

### Cross-Border Flow
```typescript
interface CrossBorderFlowAttributes {
  id: string;
  sourceCountry: string;
  destinationCountry: string;
  amount: number;
  currency: string;
  flowType: 'IMPORT'|'EXPORT'|'TRANSFER'|'REMITTANCE';
  frequency: 'DAILY'|'WEEKLY'|'MONTHLY'|'ANNUAL';
  riskScore: number;
  flagged: boolean;
  timestamp: Date;
}
```

---

## Integration Guidelines

### Sequelize Setup
```typescript
import { Sequelize } from 'sequelize';
import GeographicRiskAnalysisKit from './geographic-risk-analysis-kit';

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const kit = new GeographicRiskAnalysisKit(sequelize);
await sequelize.sync();
```

### Transaction Support
All functions support Sequelize transactions:
```typescript
const transaction = await sequelize.transaction();
try {
  const result = await kit.calculateCountryRiskScore('CHN', factors, transaction);
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

---

## Risk Scoring Methodology

### Country Risk Score Components
1. **Political Stability (25%)** - Government stability, violence risk
2. **Economic Outlook (20%)** - GDP growth, inflation, debt levels
3. **Regulatory Environment (25%)** - AML/CFT framework, FATF compliance
4. **Corruption Level (20%)** - Transparency International CPI
5. **Conflict Risk (10%)** - Active conflicts, humanitarian crises

**Risk Levels**:
- LOW: 0-24 points
- MEDIUM: 25-49 points
- HIGH: 50-74 points
- CRITICAL: 75+ points

### FATF Assessment
- **BLACK_LIST**: Immediate transaction blocking
- **GREY_LIST**: Enhanced due diligence required
- **COMPLIANT**: Standard monitoring

### Sanctions Severity
- **COMPREHENSIVE**: All transactions blocked
- **SECTORAL**: Specific industry restrictions
- **TARGETED**: Individual/entity restrictions

---

## Compliance Requirements

This kit supports compliance with:
- AML/CFT regulations (FATF 40 Recommendations)
- UN Security Council Sanctions
- OFAC sanctions (US Treasury)
- EU sanctions regimes
- CRS/FATCA (automatic exchange of information)
- Basel III risk frameworks
- Dodd-Frank section 1502 (conflict minerals)

---

## Performance Considerations

- Indexes on: countryCode, fatfStatus, corruptionPerceptionIndex, riskScore
- Batch queries return up to 100 records by default
- Regional aggregations use materialized views recommended
- Cross-border flow analysis optimized for time-series queries

---

## File Location
**Path**: `/home/user/white-cross/reuse/financial/geographic-risk-analysis-kit.ts`

---

## Version History

### 2.0.0 (Current)
- 40 comprehensive functions
- Full Sequelize ORM integration
- Enhanced type safety
- Regional contagion analysis
- Trade route risk assessment
- Political stability scoring
- Regulatory environment evaluation

---

Generated: November 8, 2025
