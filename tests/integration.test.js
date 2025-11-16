import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('integration: search -> weather -> render', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const form = document.createElement('form'); form.id = 'search-form';
    const input = document.createElement('input'); input.id = 'city-input'; input.name = 'city';
    const btn = document.createElement('button'); btn.type = 'submit'; btn.textContent = 'Buscar';
    form.appendChild(input); form.appendChild(btn);
    const status = document.createElement('div'); status.id = 'status';
    const results = document.createElement('div'); results.id = 'results';
    document.body.appendChild(form);
    document.body.appendChild(status);
    document.body.appendChild(results);

    global.fetch = vi.fn((url) => {
      if (url.includes('geocoding-api.open-meteo.com')) {
        return Promise.resolve({ ok: true, json: async () => ({ results: [{ name: 'Madrid', latitude: 40.4168, longitude: -3.7038, country: 'Spain', timezone: 'Europe/Madrid' }] }) });
      }
      if (url.includes('api.open-meteo.com')) {
        return Promise.resolve({ ok: true, json: async () => ({ current_weather: { temperature: 15, windspeed: 5, weathercode: 1, time: '2025-11-12T10:00' } }) });
      }
      return Promise.resolve({ ok: false });
    });
  });

  afterEach(async () => {
    vi.resetAllMocks();
    delete global.fetch;
    document.body.innerHTML = '';
  });

  it('renders weather after submitting the form', async () => {
    // import the module after DOM is prepared so it can bind handlers
    await import('../src/index.js');
    const input = document.getElementById('city-input');
    const form = document.getElementById('search-form');
    input.value = 'Madrid';
    fireEvent.submit(form);

    await waitFor(() => {
      const results = document.getElementById('results');
      expect(results.innerHTML).toContain('Madrid, Spain');
      expect(results.innerHTML).toContain('Temperatura');
    });
  });
});
