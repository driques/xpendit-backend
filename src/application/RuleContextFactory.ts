import { Expense, Employee } from '../domain/models';
import { RuleContext } from '../domain/rules';
import { Clock } from '../domain/ports/Clock';
import { ExchangeRateProvider } from '../domain/ports/ExchangeRateProvider';

export class RuleContextFactory {
  constructor(
    private readonly clock: Clock,
    private readonly policy: RuleContext['policy'],
    private readonly employee: Employee,
    private readonly exchangeRateProvider: ExchangeRateProvider,
    private readonly baseCurrency: string,
  ) { }

  async create(expense: Expense): Promise<RuleContext> {
    const expenseDate = new Date(expense.date);
    const now = this.clock.now();

    const expenseAgeInDays = Math.floor(
      (now.getTime() - expenseDate.getTime()) /
      (1000 * 60 * 60 * 24),
    );

    const rate = await this.exchangeRateProvider.getRate(
      expense.currency,
      this.baseCurrency,
      expenseDate,
    );

    const expenseAmountInBaseCurrency =
      expense.amount * rate;

    return {
      expense,
      employee: this.employee,
      policy: this.policy,
      expenseAgeInDays,
      expenseAmountInBaseCurrency,
    };
  }
}
