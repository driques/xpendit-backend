import { ExpenseStatus } from '../models';
import { RuleResult } from '../rules/RuleResult';

export class StatusResolver {
  static resolve(results: RuleResult[]): ExpenseStatus {
    if (results.some(r => r.status === ExpenseStatus.REJECTED)) {
      return ExpenseStatus.REJECTED;
    }

    if (results.some(r => r.status === ExpenseStatus.PENDING)) {
      return ExpenseStatus.PENDING;
    }

    if (results.some(r => r.status === ExpenseStatus.APPROVED)) {
      return ExpenseStatus.APPROVED;
    }

    return ExpenseStatus.PENDING;
  }
}
