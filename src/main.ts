import 'dotenv/config';
import { RuleEngine } from './domain/engine/RuleEngine';
import { OpenExchangeRatesClient } from './infra/exchange/OpenExchangeRatesClient';
import {
  ExpenseAgeRule,
  CategoryLimitRule,
  CostCenterCategoryRule,
  NegativeAmountRule,
} from './domain/rules';
import { Clock } from './domain/ports/Clock';
import { CsvExpenseReader } from './infra/csv/CsvExpenseReader';
import { ExpenseBatchProcessor } from './application/ExpenseBatchProcessor';
import { RuleContextFactory } from './application/RuleContextFactory';
import { Employee } from './domain/models';

class FixedClock implements Clock {
  constructor(private readonly date: Date) { }
  now(): Date {
    return this.date;
  }
}

async function main() {
  // Use a fixed date to simulate "current time" relative to the dataset (Oct 2025)
  const clock: Clock = new FixedClock(new Date('2025-11-01'));

  const policy = {
    baseCurrency: 'USD',
    costCenterRules: [
      {
        costCenter: 'core_engineering',
        forbiddenCategory: 'food',
      },
    ],
    ageLimit: {
      pendingDays: 30,
      rejectedDays: 60,
    },
    categoryLimits: {
      food: {
        approvedUpTo: 100,
        pendingUpTo: 150,
      },
      software: {
        approvedUpTo: 200,
        pendingUpTo: 300,
      },
    },
  };

  const employee = new Employee('e-1', 'Ana', 'Developer', 'core_engineering');

  const engine = new RuleEngine([
    new NegativeAmountRule(),
    new ExpenseAgeRule(clock),
    new CategoryLimitRule(),
    new CostCenterCategoryRule(),
    // Added explicit rules to ensure coverage
  ]);

  const exchangeRateProvider = new OpenExchangeRatesClient();

  const contextFactory = new RuleContextFactory(
    clock,
    policy,
    employee,
    exchangeRateProvider,
    policy.baseCurrency || 'USD',
  );

  const batchProcessor = new ExpenseBatchProcessor(engine, contextFactory);

  const reader = new CsvExpenseReader();
  const expenses = reader.read('./gastos_historicos.csv');

  const results = await batchProcessor.process(expenses);

  console.table(
    results.map((r) => ({
      expenseId: r.expenseId,
      status: r.status,
      alerts: r.alerts.map((a) => a.code).join(','),
    })),
  );

  const stats = {
    aprobados: results.filter((r) => r.status === 'APROBADO').length,
    pendientes: results.filter((r) => r.status === 'PENDIENTE').length,
    rechazados: results.filter((r) => r.status === 'RECHAZADO').length,
    anomalias: results.filter((r) =>
      r.alerts.some((a) => ['DUPLICADO', 'MONTO_INVALIDO'].includes(a.code)),
    ).length,
  };

  console.log(stats);
}

main().catch((err) => {
  console.error('Error running batch processor:', err);
  process.exit(1);
});
