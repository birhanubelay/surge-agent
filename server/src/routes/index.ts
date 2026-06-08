import { Router } from 'express';
import authRoutes from './auth';
import businessRoutes from './business';
import forecastRoutes from './forecasts';
import approvalRoutes from './approvals';

const router = Router();

router.use('/auth', authRoutes);
router.use('/business', businessRoutes);
router.use('/forecasts', forecastRoutes);
router.use('/approvals', approvalRoutes);

export default router;