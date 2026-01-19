import { Expense, Employee, Policy } from '../models';

export class RuleContext {
  constructor(
    public readonly expense: Expense,
    public readonly employee: Employee,
    public readonly policy: Policy,
    public readonly expenseAmountInBaseCurrency: number,
    public readonly expenseAgeInDays: number,
  ) {}
}
