import express, { Request, Response } from 'express';
const compression = require('compression');
import { WeatherService } from './services/weatherService';
import { WeatherResponse } from './packages/shared/weatherResponse';
import config from './config';

const app = express();
app.use(compression());
// add other middleware, cors, etc. as needed

const weatherService = new WeatherService();

// health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

interface WeatherParams {
    latitude: string;
    longitude: string;
}

// weather endpoint returns weather summary based on latitude and longitude
// for production usage we'd likely add a caching decorator with a short TTL to avoid hitting the API too often
app.get(
    '/weather/:latitude/:longitude',
    async (req: Request<WeatherParams>, res: Response<WeatherResponse>) => {
        const { latitude, longitude } = req.params;

        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);

        if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Invalid latitude or longitude');
        }

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            throw new Error(
                'Latitude must be between -90 and 90, longitude must be between -180 and 180'
            );
        }

        console.log(`Fetching weather for lat: ${lat}, lon: ${lon}`);

        const weatherSummary = await weatherService.getWeatherPoint(lat, lon);
        res.json({
            shortForecast: weatherSummary.shortForecast,
            temperatureCategory: weatherSummary.temperatureCategory,
        });
    }
);

// 404 handler
app.use((req: Request, res: Response) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Not Found' });
});

export { app };

// Global error handler (must be last!)
app.use(function (err: unknown, _req: Request, res: Response, _next: Function) {
    console.error('Unhandled error:', (err as Error).message);    
    
    // log error to telemetry system here if needed
    
    // for dev show actual message
    if(config.env !== 'production') {
        return res.status(500).json({ error: (err as Error).message });
    }

    // for production show generic message
    res.status(500).json({ error: 'Internal Server Error' });
});

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(config.port, () => {
        console.log(`Server listening at http://localhost:${config.port}`);
    });
}
