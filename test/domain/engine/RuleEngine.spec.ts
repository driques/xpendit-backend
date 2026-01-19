import { RuleEngine } from '../../../src/domain/engine/RuleEngine';
import {
  ExpenseAgeRule,
  CategoryLimitRule,
  CostCenterCategoryRule,
} from '../../../src/domain/rules';
import { ExpenseStatus, Employee } from '../../../src/domain/models';
import { buildContext } from '../helpers/buildContext';
import { Clock } from '../../../src/domain/ports/Clock';
import { FakeClock } from '../../helpers/FakeClock';

describe('RuleEngine', () => {
  let clock: Clock;
  let engine: RuleEngine;

  beforeEach(() => {
    clock = new FakeClock(
      new Date('2025-01-10'),
    );

    engine = new RuleEngine([
      new CostCenterCategoryRule(),
      new ExpenseAgeRule(clock),
      new CategoryLimitRule(),
    ]);
  });


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
