# WeatherApp

A TypeScript-based Express.js API that provides weather forecasts using the National Weather Service API.

## Features

- RESTful API for weather data by coordinates
- TypeScript for type safety
- Express 5 with automatic async error handling
- Global error handling middleware
- Comprehensive test coverage with Jest
- ESLint and Prettier for code quality
- Health check endpoint

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
cd WeatherApp
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
Run with auto-reload using ts-node (no build needed):
```bash
npm run dev
```

### Production Mode
1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm run start
```

The server will start on `http://localhost:3000` (default port).

### Environment Variables
You can configure the app using environment variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `APP_DEBUG` - Enable debug mode (true/false)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run in development mode with ts-node |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled application |
| `npm run clean` | Remove the dist folder |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint TypeScript files |
| `npm run format` | Format code with Prettier |

## API Endpoints

### Health Check
**GET** `/health`

Returns the server status.

**Response:**
```json
{
  "status": "ok"
}
```

### Get Weather Forecast
**GET** `/weather/:latitude/:longitude`

Get weather forecast for given coordinates.

**Parameters:**
- `latitude` - Latitude (-90 to 90)
- `longitude` - Longitude (-180 to 180)

**Example:**
```bash
curl http://localhost:3000/weather/40.7128/-74.0060
```

**Success Response (200):**
```json
{
  "shortForecast": "Partly Cloudy",
  "temperatureCategory": "moderate"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid latitude or longitude"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch weather data",
  "details": "Weather API error: 503 Service Unavailable"
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

The project includes:
- Unit tests for services
- Integration tests for API endpoints
- ~95% code coverage

## Project Structure

```
WeatherApp/
├── src/
│   ├── __tests__/           # Integration tests
│   ├── services/            # Business logic
│   │   ├── __tests__/       # Service unit tests
│   │   └── weatherService.ts
│   ├── middleware/          # Express middleware
│   ├── packages/shared/     # Shared types/interfaces
│   ├── config.ts            # Configuration
│   └── app.ts               # Express app setup
├── dist/                    # Compiled JavaScript (generated)
├── coverage/                # Test coverage reports (generated)
├── jest.config.js           # Jest configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.ts         # ESLint configuration
└── package.json             # Dependencies and scripts
```

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **Testing:** Jest, Supertest
- **Linting:** ESLint with TypeScript support
- **Formatting:** Prettier

## Development Workflow

1. Make changes to source files in `src/`
2. Run in dev mode: `npm run dev`
3. Write/update tests as needed
4. Run tests: `npm test`
5. Lint code: `npm run lint`
6. Build for production: `npm run build`

## License

ISC
