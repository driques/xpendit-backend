export type AgeLimitPolicy = {
  pendingDays: number;
  rejectedDays: number;
};

export type CategoryLimit = {
  approvedUpTo: number;
  pendingUpTo: number;
};

export type CostCenterRule = {
  costCenter: string;
  forbiddenCategory: string;
};

export class Policy {
  constructor(
    public readonly baseCurrency: string,
    public readonly ageLimit: AgeLimitPolicy,
    public readonly categoryLimits: Record<string, CategoryLimit>,
    public readonly costCenterRules: CostCenterRule[],
  ) {}
}
