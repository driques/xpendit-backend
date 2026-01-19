import { CategoryLimitRule } from '../../../src/domain/rules';
import { ExpenseStatus } from '../../../src/domain/models';
import { buildContext } from '../helpers/buildContext';

describe('CategoryLimitRule', () => {
  const rule = new CategoryLimitRule();

  it('returns null when category has no limits', () => {
    const context = buildContext({
      policy: {
        categoryLimits: {},
        baseCurrency: '',
        ageLimit: {
          pendingDays: 0,
          rejectedDays: 0,
        },
        costCenterRules: [],
      },
    });

    const result = rule.evaluate(context);
    expect(result).toBeNull();
  });

  it('APPROVED when amount is within approved limit', () => {
    const context = buildContext({ expenseAmountInBaseCurrency: 80 });

    const result = rule.evaluate(context)!;

    expect(result.status).toBe(ExpenseStatus.APPROVED);
  });

  it('PENDING when amount exceeds approved but within pending', () => {
    const context = buildContext({ expenseAmountInBaseCurrency: 120 });

    const result = rule.evaluate(context)!;

    expect(result.status).toBe(ExpenseStatus.PENDING);
  });

  it('REJECTED when amount exceeds pending limit', () => {
    const context = buildContext({ expenseAmountInBaseCurrency: 200 });

    const result = rule.evaluate(context)!;

    expect(result.status).toBe(ExpenseStatus.REJECTED);
  });
});
