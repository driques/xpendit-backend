import { ExpenseAgeRule } from '../../../src/domain/rules';
import { ExpenseStatus } from '../../../src/domain/models';
import { buildContext } from '../helpers/buildContext';

describe('ExpenseAgeRule', () => {
  const rule = new ExpenseAgeRule();

  it('APPROVED when expense age is within approved range', () => {
    const context = buildContext({ expenseAgeInDays: 10 });

    const result = rule.evaluate(context);

    expect(result.status).toBe(ExpenseStatus.APPROVED);
    expect(result.alerts).toHaveLength(0);
  });

  it('PENDING when expense exceeds pending threshold', () => {
    const context = buildContext({ expenseAgeInDays: 40 });

    const result = rule.evaluate(context);

    expect(result.status).toBe(ExpenseStatus.PENDING);
    expect(result.alerts[0].code).toBe('LIMITE_ANTIGUEDAD');
  });

  it('REJECTED when expense exceeds rejected threshold', () => {
    const context = buildContext({ expenseAgeInDays: 70 });

    const result = rule.evaluate(context);

    expect(result.status).toBe(ExpenseStatus.REJECTED);
    expect(result.alerts[0].code).toBe('LIMITE_ANTIGUEDAD');
  });
});
