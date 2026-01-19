import { CostCenterCategoryRule } from '../../../src/domain/rules';
import { ExpenseStatus } from '../../../src/domain/models';
import { buildContext } from '../helpers/buildContext';
import { Employee } from '../../../src/domain/models';

describe('CostCenterCategoryRule', () => {
  const rule = new CostCenterCategoryRule();

  it('REJECTED when cost center is forbidden for category', () => {
    const employee = new Employee('e-1', 'Ana', 'Dev', 'core_engineering');

    const context = buildContext({ employee });

    const result = rule.evaluate(context)!;

    expect(result.status).toBe(ExpenseStatus.REJECTED);
    expect(result.alerts[0].code).toBe('POLITICA_CENTRO_COSTO');
  });

  it('returns null when no rule is violated', () => {
    const context = buildContext();

    const result = rule.evaluate(context);

    expect(result).toBeNull();
  });
});
