import { Rule } from './Rule';
import { RuleContext } from './RuleContext';
import { RuleResult } from './RuleResult';
import { ExpenseStatus, Alert } from '../models';

export class ExpenseAgeRule implements Rule {
  evaluate(context: RuleContext): RuleResult {
    const { expenseAgeInDays, policy } = context;
    const { pendingDays, rejectedDays } = policy.ageLimit;

    if (expenseAgeInDays > rejectedDays) {
      return new RuleResult(ExpenseStatus.REJECTED, [
        new Alert(
          'LIMITE_ANTIGUEDAD',
          `Gasto excede los ${rejectedDays} días.`,
        ),
      ]);
    }

    if (expenseAgeInDays > pendingDays) {
      return new RuleResult(ExpenseStatus.PENDING, [
        new Alert(
          'LIMITE_ANTIGUEDAD',
          `Gasto excede los ${pendingDays} días. Requiere revisión.`,
        ),
      ]);
    }

    return new RuleResult(ExpenseStatus.APPROVED);
  }
}
