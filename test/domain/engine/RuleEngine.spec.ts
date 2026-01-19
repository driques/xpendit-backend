import { RuleEngine } from '../../../src/domain/engine/RuleEngine';
import {
  ExpenseAgeRule,
  CategoryLimitRule,
  CostCenterCategoryRule,
} from '../../../src/domain/rules';
import { ExpenseStatus, Employee } from '../../../src/domain/models';
import { buildContext } from '../helpers/buildContext';

describe('RuleEngine', () => {
  const engine = new RuleEngine([
    new CostCenterCategoryRule(),
    new ExpenseAgeRule(),
    new CategoryLimitRule(),
  ]);

  it('REJECTED has priority over PENDING and APPROVED', () => {
    const employee = new Employee('e-1', 'Ana', 'Dev', 'core_engineering');

    const context = buildContext({
      employee,
      expenseAgeInDays: 10,
      expenseAmountInBaseCurrency: 50,
    });

    const result = engine.evaluate(context);

    expect(result.status).toBe(ExpenseStatus.REJECTED);
  });

  it('PENDING when no rejected but at least one pending', () => {
    const context = buildContext({
      expenseAgeInDays: 40,
      expenseAmountInBaseCurrency: 120,
    });

    const result = engine.evaluate(context);

    expect(result.status).toBe(ExpenseStatus.PENDING);
  });

  it('APPROVED when all rules approve', () => {
    const context = buildContext({
      expenseAgeInDays: 10,
      expenseAmountInBaseCurrency: 80,
    });

    const result = engine.evaluate(context);

    expect(result.status).toBe(ExpenseStatus.APPROVED);
  });
});
