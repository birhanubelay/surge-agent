import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/setup', authenticate, BusinessController.setup);
router.get('/profile', authenticate, BusinessController.getProfile);

export default router;