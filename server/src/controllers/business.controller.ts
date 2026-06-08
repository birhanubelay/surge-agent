import { Request, Response } from 'express';
import { BusinessService } from '../services/business.service';
import { BusinessSetupInput } from '../types';

export class BusinessController {
  static async setup(req: Request, res: Response) {
    try {
      const ownerId = (req as any).user?.userId;
      
      if (!ownerId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const input: BusinessSetupInput = req.body;
      
      if (!input.name) {
        return res.status(400).json({ error: 'Business name is required' });
      }

      const result = await BusinessService.setupBusiness(ownerId, input);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Business already registered for this user') {
        return res.status(400).json({ error: error.message });
      }
      console.error('[BusinessController.setup]', error);
      res.status(500).json({ error: 'Business setup failed' });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const ownerId = (req as any).user?.userId;
      
      if (!ownerId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const result = await BusinessService.getBusinessByOwnerId(ownerId);
      
      if (!result) {
        return res.status(404).json({ error: 'Business profile not found' });
      }

      res.json(result);
    } catch (error) {
      console.error('[BusinessController.getProfile]', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}