import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCurrentWeather } from '../src/api/weather.js';

describe('getCurrentWeather', () => {
  beforeEach(() => { global.fetch = vi.fn(); });
  afterEach(() => { vi.resetAllMocks(); delete global.fetch; });

  it('returns current_weather object on success', async () => {
    const mock = { current_weather: { temperature: 12.3, windspeed: 3.4, weathercode: 1, time: '2025-11-12T10:00' } };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mock });
    const w = await getCurrentWeather(40.4, -3.7);
    expect(w).toEqual(mock.current_weather);
  });

  it('returns null when current_weather missing', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    const w = await getCurrentWeather(0,0);
    expect(w).toBeNull();
  });

  it('throws on HTTP error', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(getCurrentWeather(0,0)).rejects.toThrow('Weather API error');
  });
});
