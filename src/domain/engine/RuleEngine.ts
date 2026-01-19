import { Rule, RuleContext } from '../rules';
import { ValidationResult } from '../models';
import { StatusResolver } from './StatusResolver';

export class RuleEngine {
  constructor(private readonly rules: Rule[]) {}
  evaluate(context: RuleContext): ValidationResult {
    const results = this.rules
      .map(rule => rule.evaluate(context))
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const status = StatusResolver.resolve(results);

    const alerts = results.flatMap(r => r.alerts);

    return new ValidationResult(
      context.expense.id,
      status,
      alerts,
    );
  }
}
