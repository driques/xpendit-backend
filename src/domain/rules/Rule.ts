import { RuleContext } from './RuleContext';
import { RuleResult } from './RuleResult';

export interface Rule {
  evaluate(context: RuleContext): RuleResult | null;
}
