import { ExchangeRateProvider } from '../../domain/ports/ExchangeRateProvider';
import { OpenExchangeRatesResponse } from '../interfaces/IOpenExchangeRatesResponse';

export class OpenExchangeRatesClient implements ExchangeRateProvider {
  private readonly appId: string;
  private readonly baseUrl: string;
  private readonly requestCache: Map<string, Promise<OpenExchangeRatesResponse>> = new Map();

  constructor() {
    const appId = process.env.OPEN_EXCHANGE_APP_ID;
    const baseUrl = process.env.OPEN_EXCHANGE_BASE_URL;

    if (!appId) {
      throw new Error(
        'OPEN_EXCHANGE_APP_ID environment variable is not defined',
      );
    }

    this.appId = appId;
    this.baseUrl = (baseUrl || 'https://openexchangerates.org/api').replace(
      /\/$/,
      '',
    );
  }

  async getRate(from: string, to: string, date: Date): Promise<number> {
    if (from === to) {
      return 1;
    }

    const dateStr = date.toISOString().split('T')[0];

    //n+1 problem
    if (!this.requestCache.has(dateStr)) {
      this.requestCache.set(dateStr, this.fetchRates(dateStr));
    }

    const data = await this.requestCache.get(dateStr)!;

    const fromRate = data.rates[from];
    const toRate = data.rates[to];

    if (fromRate === undefined || toRate === undefined) {
      throw new Error(`Currency not supported: ${from} or ${to}`);
    }
    return toRate / fromRate;
  }

  private async fetchRates(dateStr: string): Promise<OpenExchangeRatesResponse> {
    const url = `${this.baseUrl}/historical/${dateStr}.json?app_id=${this.appId}`;
    const response = await fetch(url);

    if (!response.ok) {
      const maskedUrl = url.replace(this.appId, '***');
      throw new Error(`Failed to fetch exchange rates: ${response.status} ${response.statusText} - ${maskedUrl}`);
    }

    return (await response.json()) as OpenExchangeRatesResponse;
  }
}
