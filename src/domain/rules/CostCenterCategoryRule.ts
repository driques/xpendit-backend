import { Rule } from './Rule';
import { RuleContext } from './RuleContext';
import { RuleResult } from './RuleResult';
import { ExpenseStatus, Alert } from '../models';

export class CostCenterCategoryRule implements Rule {
  evaluate(context: RuleContext): RuleResult | null {
    const { employee, expense, policy } = context;

    const violatedRule = policy.costCenterRules.find(
      (rule) =>
        rule.costCenter === employee.costCenter &&
        rule.forbiddenCategory === expense.category,
    );

    if (!violatedRule) {
      return null;
    }

    return new RuleResult(ExpenseStatus.REJECTED, [
      new Alert(
        'POLITICA_CENTRO_COSTO',
        'Rendición prohibida',
      ),
    ]);
  }
}
