import { Rule } from './Rule';
import { RuleContext } from './RuleContext';
import { RuleResult } from './RuleResult';
import { ExpenseStatus, Alert } from '../models';

export class CategoryLimitRule implements Rule {
  evaluate(context: RuleContext): RuleResult | null {
    const { expense, policy, expenseAmountInBaseCurrency } = context;
    const limits = policy.categoryLimits[expense.category];

    if (!limits) {
      return null;
    }

    const { approvedUpTo, pendingUpTo } = limits;

    if (expenseAmountInBaseCurrency > pendingUpTo) {
      return new RuleResult(ExpenseStatus.REJECTED, [
        new Alert(
          'LIMITE_CATEGORIA',
          'Excede límite aprobado',
        ),
      ]);
    }

    if (expenseAmountInBaseCurrency > approvedUpTo) {
      return new RuleResult(ExpenseStatus.PENDING, [
        new Alert(
          'LIMITE_CATEGORIA',
          'Requiere revisión',
        ),
      ]);
    }

    return new RuleResult(ExpenseStatus.APPROVED);
  }
}
