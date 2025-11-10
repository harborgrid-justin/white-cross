export enum ProviderType {
  EXPERIMENTAL = 'experimental',
  ANALYTICS = 'analytics',
  CACHEABLE = 'cacheable',
  MONITORED = 'monitored',
  RATE_LIMITED = 'rate-limited',
  ALL = 'all',
}

export enum MonitoringLevel {
  BASIC = 'basic',
  DETAILED = 'detailed',
}

export enum FeatureFlag {
  EXPERIMENTAL = 'experimental',
  BETA = 'beta',
  STABLE = 'stable',
  DEPRECATED = 'deprecated',
}
