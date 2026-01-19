import { ExpenseAgeRule } from '../../../src/domain/rules';
import { ExpenseStatus } from '../../../src/domain/models';
import { FakeClock } from '../../helpers/FakeClock';
import { buildContext } from '../helpers/buildContext';
import { Clock } from '../../../src/domain/ports/Clock';

describe('ExpenseAgeRule', () => {
  it('REJECTED when expense is older than rejectedDays', () => {
    const clock: Clock = new FakeClock(new Date('2025-01-10'));

    const rule = new ExpenseAgeRule(clock);

    const context = buildContext({
      expense: {
        date: '2024-12-01',
        id: '',
        amount: 0,
        currency: '',
        category: '',
      },
      policy: {
        ageLimit: {
          pendingDays: 5,
          rejectedDays: 10,
        },
        baseCurrency: '',
        categoryLimits: {},
        costCenterRules: [],
      },
    });

    const result = rule.evaluate(context)!;

    expect(result.status).toBe(ExpenseStatus.REJECTED);
  });
});
