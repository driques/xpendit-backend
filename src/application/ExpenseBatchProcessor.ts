import { RuleEngine } from '../domain/engine/RuleEngine';
import { Expense, ExpenseStatus, Alert } from '../domain/models';
import { RuleContextFactory } from './RuleContextFactory';

export class ExpenseBatchProcessor {
  constructor(
    private readonly engine: RuleEngine,
    private readonly contextFactory: RuleContextFactory,
  ) { }

  async process(expenses: Expense[]) {
    const results: { expenseId: string; status: ExpenseStatus; alerts: Alert[] }[] = [];

    const seenExpenses = new Set<string>();

    for (const expense of expenses) {
      const context = await this.contextFactory.create(expense);

      const result = this.engine.evaluate(context);

      // Duplicate Detection
      const key = `${expense.amount}-${expense.currency}-${expense.date}`;
      if (seenExpenses.has(key)) {
        result.alerts.push(new Alert('DUPLICADO', 'Gasto duplicado exacto detectado.'));
      } else {
        seenExpenses.add(key);
      }

      results.push({
        expenseId: expense.id,
        status: result.status,
        alerts: result.alerts,
      });
    }

    return results;
  }
}
