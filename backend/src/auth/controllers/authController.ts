import { Request, Response } from 'express';
import { loginUserService } from '../services/authService';

/**
 * Controller: Handle login and send token
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const result = await loginUserService({ email, password });

    res.status(200).json(result);
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
