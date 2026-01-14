import { WeatherResponse } from '../packages/shared/weatherResponse';

interface GovernmentWeatherPoint {
    properties: {
        forecast?: string;
        forecastHourly?: string;
        forecastGridData?: string;
        observationStations?: string;
        [key: string]: any;
    };
}

export class WeatherService {
    private baseUrl = 'https://api.weather.gov';

    async getWeatherPoint(latitude: number, longitude: number): Promise<WeatherResponse> {
        const url = `${this.baseUrl}/points/${latitude},${longitude}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'WeatherApp',
            },
        });

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as GovernmentWeatherPoint;

        if (!data.properties.forecast) {
            throw new Error('No forecast URL in response');
        }

        // Fetch the actual forecast from the URL provided
        const forecastResponse = await fetch(data.properties.forecast, {
            headers: {
                'User-Agent': 'WeatherApp',
            },
        });

        if (!forecastResponse.ok) {
            throw new Error(`Forecast fetch error: ${forecastResponse.status}`);
        }

        const forecastData = (await forecastResponse.json()) as any;
        const periods = forecastData.properties.periods;

        if (!periods || periods.length === 0) {
            throw new Error('No forecast periods available');
        }

        const currentPeriod = periods[0];
        const summary: WeatherResponse = {
            shortForecast: currentPeriod.shortForecast,
            temperatureCategory: this.classifyTemp(currentPeriod.temperature),
        };

        return summary;
    }

    classifyTemp(tempF: number): 'hot' | 'cold' | 'moderate' {
        if (tempF < 45) {
            return 'cold';
        }
        if (tempF > 80) {
            return 'hot';
        }

        return 'moderate';
    }
}
