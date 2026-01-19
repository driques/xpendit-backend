import { ExpenseStatus, Alert } from '../models';

export class RuleResult {
  constructor(
    public readonly status: ExpenseStatus,
    public readonly alerts: Alert[] = [],
  ) {}
}
