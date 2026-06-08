import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config';
import routes from './routes';

dotenv.config();

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'SurgeAgent API',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

app.use('/api', routes);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[Express Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(` Server running on http://localhost:${config.port}`);
  console.log(` Environment: ${config.nodeEnv}`);
});