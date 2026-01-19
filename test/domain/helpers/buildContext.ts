import { RuleContext } from '../../../src/domain/rules';
import { Expense } from '../../../src/domain/models';
import { Employee } from '../../../src/domain/models';
import { Policy } from '../../../src/domain/models';

export function buildContext(overrides?: Partial<RuleContext>): RuleContext {
  const expense = new Expense(
    'g-1',
    100,
    'USD',
    '2025-01-01',
    'food',
  );

  const employee = new Employee(
    'e-1',
    'Juan',
    'Perez',
    'sales_team',
  );

  const policy = new Policy(
    'USD',
    {
      pendingDays: 30,
      rejectedDays: 60,
    },
    {
      food: {
        approvedUpTo: 100,
        pendingUpTo: 150,
      },
    },
    [
      {
        costCenter: 'core_engineering',
        forbiddenCategory: 'food',
      },
    ],
  );

  return new RuleContext(
    overrides?.expense ?? expense,
    overrides?.employee ?? employee,
    overrides?.policy ?? policy,
    overrides?.expenseAmountInBaseCurrency ?? 100,
    overrides?.expenseAgeInDays ?? 10,
  );
}
