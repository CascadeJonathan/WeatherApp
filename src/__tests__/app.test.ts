import request from 'supertest';
import { app } from '../app';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Weather API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /weather/:latitude/:longitude', () => {
        it('should return weather data for valid coordinates', async () => {
            const mockPointsResponse = {
                properties: {
                    forecast: 'https://api.weather.gov/gridpoints/SEW/124,67/forecast',
                },
            };

            const mockForecastResponse = {
                properties: {
                    periods: [
                        {
                            shortForecast: 'Partly Cloudy',
                            temperature: 65,
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

            const response = await request(app).get('/weather/47.6062/-122.3321').expect(200);

            expect(response.body).toEqual({
                shortForecast: 'Partly Cloudy',
                temperatureCategory: 'moderate',
            });
        });

        it('should return 400 for invalid latitude', async () => {
            const response = await request(app).get('/weather/invalid/-122.3321').expect(400);

            expect(response.body).toEqual({
                error: 'Invalid latitude or longitude',
            });
        });

        it('should return 400 for invalid longitude', async () => {
            const response = await request(app).get('/weather/47.6062/invalid').expect(400);

            expect(response.body).toEqual({
                error: 'Invalid latitude or longitude',
            });
        });

        it('should return 400 for latitude out of range', async () => {
            const response = await request(app).get('/weather/91.0/-122.3321').expect(400);

            expect(response.body).toEqual({
                error: 'Latitude must be between -90 and 90, longitude must be between -180 and 180',
            });
        });

        it('should return 400 for longitude out of range', async () => {
            const response = await request(app).get('/weather/47.6062/-181.0').expect(400);

            expect(response.body).toEqual({
                error: 'Latitude must be between -90 and 90, longitude must be between -180 and 180',
            });
        });

        it('should return 500 when weather API fails', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 503,
                statusText: 'Service Unavailable',
            });

            const response = await request(app).get('/weather/47.6062/-122.3321').expect(500);

            expect(response.body).toHaveProperty('error', 'Failed to fetch weather data');
            expect(response.body).toHaveProperty('details');
            expect(response.body.details).toContain('Weather API error: 503');
        });

        it('should classify temperature as cold', async () => {
            const mockPointsResponse = {
                properties: {
                    forecast: 'https://api.weather.gov/gridpoints/SEW/124,67/forecast',
                },
            };

            const mockForecastResponse = {
                properties: {
                    periods: [
                        {
                            shortForecast: 'Snow',
                            temperature: 30,
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

            const response = await request(app).get('/weather/47.6062/-122.3321').expect(200);

            expect(response.body.temperatureCategory).toBe('cold');
        });

        it('should classify temperature as hot', async () => {
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
                            temperature: 95,
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

            const response = await request(app).get('/weather/47.6062/-122.3321').expect(200);

            expect(response.body.temperatureCategory).toBe('hot');
        });
    });
});
