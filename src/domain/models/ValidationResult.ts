import { ExpenseStatus } from './ExpenseStatus';
import { Alert } from './Alert';

export class ValidationResult {
  constructor(
    public readonly expenseId: string,
    public readonly status: ExpenseStatus,
    public readonly alerts: Alert[] = [],
  ) {}
}
