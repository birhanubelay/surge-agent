import { Request, Response } from 'express';
import { ForecastService } from '../services/forecast.service';
import { GenerateForecastInput } from '../types';

export class ForecastController {
  static async generate(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const input: GenerateForecastInput = req.body;
      
      if (!input.matchId) {
        return res.status(400).json({ error: 'matchId is required' });
      }

      // Get user's business
      const business = await (await import('../services/business.service')).BusinessService.getBusinessByOwnerId(userId);
      
      if (!business) {
        return res.status(404).json({ error: 'Business profile not found. Please set up your business first.' });
      }

      const result = await ForecastService.generateForecast(business.id, input);
      res.status(201).json(result);
    } catch (error) {
      console.error('[ForecastController.generate]', error);
      res.status(500).json({ error: 'Forecast generation failed' });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const business = await (await import('../services/business.service')).BusinessService.getBusinessByOwnerId(userId);
      
      if (!business) {
        return res.status(404).json({ error: 'No business found' });
      }

      const results = await ForecastService.getForecastsByBusinessId(business.id);
      res.json({ forecasts: results });
    } catch (error) {
      console.error('[ForecastController.list]', error);
      res.status(500).json({ error: 'Failed to fetch forecasts' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await ForecastService.getForecastById(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Forecast not found' });
      }

      res.json(result);
    } catch (error) {
      console.error('[ForecastController.getById]', error);
      res.status(500).json({ error: 'Internal error' });
    }
  }
}