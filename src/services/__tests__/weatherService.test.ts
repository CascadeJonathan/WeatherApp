import { WeatherService } from '../weatherService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('WeatherService', () => {
    let weatherService: WeatherService;

    beforeEach(() => {
        weatherService = new WeatherService();
        jest.clearAllMocks();
    });

    describe('getWeatherPoint', () => {
        it('should fetch weather data successfully', async () => {
            const mockPointsResponse = {
                properties: {
                    forecast: 'https://api.weather.gov/gridpoints/SEW/124,67/forecast',
                },
            };

            const mockForecastResponse = {
                properties: {
                    periods: [
                        {
                            shortForecast: 'Sunny',
                            temperature: 75,
                        },
                    ],
                },
            };

            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPointsResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockForecastResponse,
                });

            const result = await weatherService.getWeatherPoint(47.6062, -122.3321);

            expect(result).toEqual({
                shortForecast: 'Sunny',
                temperatureCategory: 'moderate',
            });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should throw error when points API returns 404', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(weatherService.getWeatherPoint(47.6062, -122.3321)).rejects.toThrow(
                'Weather API error: 404 Not Found'
            );
        });

        it('should throw error when no forecast URL is provided', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ properties: {} }),
            });

            await expect(weatherService.getWeatherPoint(47.6062, -122.3321)).rejects.toThrow(
                'No forecast URL in response'
            );
        });

        it('should throw error when forecast fetch fails', async () => {
            const mockPointsResponse = {
                properties: {
                    forecast: 'https://api.weather.gov/gridpoints/SEW/124,67/forecast',
                },
            };

            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPointsResponse,
                })
                .mockResolvedValueOnce({
                    ok: false,
                    status: 500,
                });

            await expect(weatherService.getWeatherPoint(47.6062, -122.3321)).rejects.toThrow(
                'Forecast fetch error: 500'
            );
        });
    });

    describe('classifyTemp', () => {
        it('should classify temperature as cold when below 45', () => {
            expect(weatherService.classifyTemp(30)).toBe('cold');
            expect(weatherService.classifyTemp(44)).toBe('cold');
        });

        it('should classify temperature as hot when above 80', () => {
            expect(weatherService.classifyTemp(85)).toBe('hot');
            expect(weatherService.classifyTemp(100)).toBe('hot');
        });

        it('should classify temperature as moderate between 45 and 80', () => {
            expect(weatherService.classifyTemp(45)).toBe('moderate');
            expect(weatherService.classifyTemp(65)).toBe('moderate');
            expect(weatherService.classifyTemp(80)).toBe('moderate');
        });
    });
});
