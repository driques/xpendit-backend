import { ExchangeRateProvider } from 'src/domain/ports/ExchangeRateProvider';
import { OpenExchangeRatesResponse } from '../interfaces/IOpenExchangeRatesResponse';

export class OpenExchangeRatesClient implements ExchangeRateProvider {
  private readonly appId: string;
  private readonly baseUrl: string;

  constructor() {
    const appId = process.env.OPEN_EXCHANGE_APP_ID;
    const baseUrl = process.env.OPEN_EXCHANGE_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        'OPEN_EXCHANGE_BASE_URL environment variable is not defined',
      );
    }

    if (!appId) {
      throw new Error(
        'OPEN_EXCHANGE_APP_ID environment variable is not defined',
      );
    }

    this.appId = appId;
    this.baseUrl = baseUrl;
  }

  async getRate(from: string, to: string): Promise<number> {
    if (from === to) {
      return 1;
    }

    const response = await fetch(
      `${this.baseUrl}?app_id=${this.appId}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = (await response.json()) as OpenExchangeRatesResponse;

    const fromRate = data.rates[from];
    const toRate = data.rates[to];

    if (!fromRate || !toRate) {
      throw new Error(`Currency not supported: ${from} or ${to}`);
    }

    return toRate / fromRate;
  }
}
