import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const input: RegisterInput = req.body;
      
      if (!input.email || !input.password || !input.firstName || !input.lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await AuthService.register(input);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return res.status(400).json({ error: error.message });
      }
      console.error('[AuthController.register]', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const input: LoginInput = req.body;
      
      if (!input.email || !input.password) {
        return res.status(400).json({ error: 'Missing email or password' });
      }

      const result = await AuthService.login(input);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      console.error('[AuthController.login]', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const input: RefreshTokenInput = req.body;
      
      if (!input.refreshToken) {
        return res.status(400).json({ error: 'Missing refresh token' });
      }

      const result = await AuthService.refreshToken(input);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Invalid refresh token' || error.message === 'Session expired') {
        return res.status(401).json({ error: error.message });
      }
      console.error('[AuthController.refreshToken]', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      await AuthService.logout(userId);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('[AuthController.logout]', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
}