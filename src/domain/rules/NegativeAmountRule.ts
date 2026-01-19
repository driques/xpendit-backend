import { Rule } from './Rule';
import { RuleContext } from './RuleContext';
import { RuleResult } from './RuleResult';
import { ExpenseStatus, Alert } from '../models';

export class NegativeAmountRule implements Rule {
    evaluate(context: RuleContext): RuleResult | null {
        const { expense } = context;

        if (expense.amount < 0) {
            return new RuleResult(ExpenseStatus.REJECTED, [
                new Alert('MONTO_INVALIDO', 'El monto no puede ser negativo.'),
            ]);
        }

        return null;
    }
}
