import { Rule } from './Rule';
import { RuleContext } from './RuleContext';
import { RuleResult } from './RuleResult';
import { ExpenseStatus, Alert } from '../models';
import { Clock } from '../ports/Clock';

export class ExpenseAgeRule implements Rule {
  constructor(private readonly clock: Clock) {}

  evaluate(context: RuleContext): RuleResult | null {
    const { expense, policy } = context;
    const { pendingDays, rejectedDays } = policy.ageLimit;

    const now = this.clock.now();
    const expenseDate = new Date(expense.date);

    const ageInDays = Math.floor(
      (now.getTime() - expenseDate.getTime()) /
      (1000 * 60 * 60 * 24),
    );

    if (ageInDays > rejectedDays) {
      return new RuleResult(ExpenseStatus.REJECTED, [
        new Alert(
          'LIMITE_ANTIGUEDAD',
          `Gasto excede los ${rejectedDays} días.`,
        ),
      ]);
    }

    if (ageInDays > pendingDays) {
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
