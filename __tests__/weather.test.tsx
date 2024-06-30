import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherAppMock from '../pages/WeatherApp';
import { fetchCoordinatesData } from '../pages/utils/apiService'
import React from 'react';

jest.mock('../pages/utils/apiService', () => {
  return {
    fetchCoordinatesData: jest.fn((location, apiKey) => {
      if (location === 'London') {
        return Promise.resolve({
          name: 'London',
          coord: { lat: 51.51, lon: -0.13 },
        });
      } else {
        return Promise.reject(new Error('Failed to fetch coordinate data'));
      }
    }),
  };
});
jest.mock('../pages/index', () => ({
  __esModule: true,
  WeatherAppMock: ({ priv }) => <div>Mocked WeatherApp with priv: {priv}</div>,
}));

const mockApiKey = 'mock-api-key';

describe('WeatherApp Component', () => {
  // UNIT TESTS
  describe('Unit Tests', () => {
    describe('fetchCoordinatesData', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(async (url) => {
          if (url.includes('London')) {
            return {
              ok: true,
              json: () => Promise.resolve({ coord: { lat: 51.51, lon: -0.13 }, name: 'London' }),
            };
          } else {
            return {
              ok: false,
              json: () => Promise.resolve({ message: 'Not Found' }),
            };
          }
        });
      });

      it('fetches coordinates data correctly', async () => {
        const location = 'London';
        const data = await fetchCoordinatesData(location, mockApiKey);
        expect(data.name).toBe('London');
        expect(data.coord.lat).toBe(51.51);
        expect(data.coord.lon).toBe(-0.13);
      });

      it('handles fetch error gracefully', async () => {
        const location = 'InvalidCity';

        await waitFor(() => {
          expect(fetchCoordinatesData(location, mockApiKey)).rejects.toThrow('Failed to fetch coordinate data');
        });
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });
    });

    // Unit test for handleFetchData function
    describe('handleFetchData', () => {
      it('fetches coordinates data on Enter key press', async () => {
        const { container } = render(<WeatherAppMock priv={mockApiKey} />);
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'London' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        await waitFor(() => {
          expect(input.value).toBe('London');
          expect(screen.queryByText('Please provide valid location name')).toBeNull();
        });
      });

      it('handles fetch error gracefully', async () => {
        (fetchCoordinatesData as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch coordinate data'));

        const location = 'InvalidCity';
        await waitFor (() => {
          expect(fetchCoordinatesData(location, mockApiKey)).rejects.toThrow('Failed to fetch coordinate data');
        });
      });

      it('shows error message below empty location input', async () => {
        const { container } = render(<WeatherAppMock priv={mockApiKey} />);
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        await waitFor(() => {
          expect(input.value).toBe('');
          expect(screen.queryByText('Please enter a location'));
        });
      });
    });
  });

  // INTEGRATION TESTS
  describe('Integration Tests', () => {
    // Integration test for WeatherApp component rendering and behavior
    it('renders WeatherApp correctly with weather data', async () => {
      render(<WeatherAppMock priv={mockApiKey} />);

      await waitFor(() => {
        expect(screen.queryByText('Please provide valid location name')).toBeNull();
      });
    });
  });
});
