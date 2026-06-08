import { Request, Response } from 'express';
import { ApprovalService } from '../services/approval.service';

export class ApprovalController {
  static async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const result = await ApprovalService.approveApproval(id, userId);
      res.json({ approval: result, message: 'Approved. Execution pending.' });
    } catch (error) {
      console.error('[ApprovalController.approve]', error);
      res.status(500).json({ error: 'Approval failed' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await ApprovalService.getApprovalById(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Approval not found' });
      }

      res.json(result);
    } catch (error) {
      console.error('[ApprovalController.getById]', error);
      res.status(500).json({ error: 'Internal error' });
    }
  }
}