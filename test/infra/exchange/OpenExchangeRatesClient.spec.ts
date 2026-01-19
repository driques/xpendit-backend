import { OpenExchangeRatesClient } from 'src/infra/exchange/OpenExchangeRatesClient';

describe('OpenExchangeRatesClient', () => {
  beforeEach(() => {
    process.env.OPEN_EXCHANGE_APP_ID = 'test-app-id';
    process.env.OPEN_EXCHANGE_BASE_URL = 'https://mock.api';
    // Mock global fetch
    global.fetch = jest.fn();
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete process.env.OPEN_EXCHANGE_APP_ID;
    delete process.env.OPEN_EXCHANGE_BASE_URL;
  });

  it('returns 1 when currencies are the same and does not call fetch', async () => {
    const client = new OpenExchangeRatesClient();

    const rate = await client.getRate('USD', 'USD', new Date());

    expect(rate).toBe(1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns correct exchange rate for historical date', async () => {
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
    const date = new Date('2023-10-01T12:00:00Z');

    const rate = await client.getRate('USD', 'CLP', date);

    expect(rate).toBe(900);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://mock.api/historical/2023-10-01.json?app_id=test-app-id',
    );
  });

  it('throws when api responds with error', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    const client = new OpenExchangeRatesClient();
    const date = new Date();

    await expect(
      client.getRate('USD', 'CLP', date),
    ).rejects.toThrow('Failed to fetch exchange rates: Not Found');
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
    const date = new Date();

    await expect(
      client.getRate('USD', 'CLP', date),
    ).rejects.toThrow('Currency not supported');
  });

  it('throws on construction if OPEN_EXCHANGE_APP_ID is missing', () => {
    delete process.env.OPEN_EXCHANGE_APP_ID;

    expect(() => new OpenExchangeRatesClient()).toThrow(
      'OPEN_EXCHANGE_APP_ID environment variable is not defined',
    );
  });

  it('uses default base url if NOT provided', async () => {
    delete process.env.OPEN_EXCHANGE_BASE_URL;
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        base: 'USD',
        rates: { USD: 1, EUR: 0.9 },
      }),
    });

    const client = new OpenExchangeRatesClient();
    const date = new Date('2023-01-01');
    await client.getRate('USD', 'EUR', date);

    expect(fetch).toHaveBeenCalledWith(
      'https://openexchangerates.org/api/historical/2023-01-01.json?app_id=test-app-id',
    );
  });
});
