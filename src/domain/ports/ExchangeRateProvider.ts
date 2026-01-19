export interface ExchangeRateProvider {
  getRate(from: string, to: string, date: Date): Promise<number>;
}
