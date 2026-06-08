import { Router } from 'express';
import { ApprovalController } from '../controllers/approval.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:id/approve', authenticate, ApprovalController.approve);
router.get('/:id', authenticate, ApprovalController.getById);

export default router;