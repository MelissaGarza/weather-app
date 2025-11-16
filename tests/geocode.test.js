import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { searchCity } from '../src/api/geocode.js';

describe('searchCity', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
    delete global.fetch;
  });

  it('returns lat/lon for a valid city', async () => {
    const mockResponse = { results: [{ name: 'Madrid', latitude: 40.4168, longitude: -3.7038, country: 'Spain', timezone: 'Europe/Madrid' }] };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const res = await searchCity('Madrid');
    expect(res).toEqual({
      name: 'Madrid',
      latitude: 40.4168,
      longitude: -3.7038,
      country: 'Spain',
      timezone: 'Europe/Madrid'
    });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('returns null when city is not found', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    const res = await searchCity('NoExisteCiudad');
    expect(res).toBeNull();
  });

  it('throws on HTTP error', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(searchCity('Madrid')).rejects.toThrow('Geocoding API error');
  });
});
