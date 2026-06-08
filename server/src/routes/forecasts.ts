import { Router } from 'express';
import { ForecastController } from '../controllers/forecast.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/generate', authenticate, ForecastController.generate);
router.get('/', authenticate, ForecastController.list);
router.get('/:id', authenticate, ForecastController.getById);

export default router;