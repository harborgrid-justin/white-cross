/**
 * Chronic condition status indicating management phase and clinical state.
 *
 * Status drives care workflows, review scheduling, and reporting:
 * - ACTIVE: Requires ongoing management and monitoring
 * - MANAGED: Under control but still requires periodic review
 * - RESOLVED: Successfully treated or outgrown, minimal monitoring
 * - MONITORING: Under observation, not yet confirmed or actively managed
 */
export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  RESOLVED = 'RESOLVED',
  MONITORING = 'MONITORING',
}
