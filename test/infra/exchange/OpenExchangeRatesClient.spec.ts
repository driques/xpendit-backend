import { OpenExchangeRatesClient } from 'src/infra/exchange/OpenExchangeRatesClient';

describe('OpenExchangeRatesClient', () => {
  beforeEach(() => {
    process.env.OPEN_EXCHANGE_APP_ID = 'test-app-id';
    process.env.OPEN_EXCHANGE_BASE_URL = 'https://mock.api/latest.json';
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete process.env.OPEN_EXCHANGE_APP_ID;
    delete process.env.OPEN_EXCHANGE_BASE_URL;
  });

  it('returns 1 when currencies are the same and does not call fetch', async () => {
    const client = new OpenExchangeRatesClient();

    const rate = await client.getRate('USD', 'USD');

    expect(rate).toBe(1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns correct exchange rate', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        base: 'USD',
        rates: {
          USD: 1,
          CLP: 900,
        },
      }),
    });

    const client = new OpenExchangeRatesClient();

    const rate = await client.getRate('USD', 'CLP');

    expect(rate).toBe(900);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://mock.api/latest.json?app_id=test-app-id',
    );
  });

  it('throws when api responds with error', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const client = new OpenExchangeRatesClient();

    await expect(
      client.getRate('USD', 'CLP'),
    ).rejects.toThrow('Failed to fetch exchange rates');
  });

  it('throws when currency is not supported', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        base: 'USD',
        rates: {
          USD: 1,
        },
      }),
    });

    const client = new OpenExchangeRatesClient();

    await expect(
      client.getRate('USD', 'CLP'),
    ).rejects.toThrow('Currency not supported');
  });

  it('throws on construction if OPEN_EXCHANGE_APP_ID is missing', () => {
    delete process.env.OPEN_EXCHANGE_APP_ID;

    expect(() => new OpenExchangeRatesClient()).toThrow(
      'OPEN_EXCHANGE_APP_ID environment variable is not defined',
    );
  });
});
