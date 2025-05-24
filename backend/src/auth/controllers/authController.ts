import { Request, Response } from 'express';
import { loginUserService } from '../services/authService';

/**
 * Controller: Handle login and send token
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, companyId } = req.body; // ✅ Add companyId

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const result = await loginUserService({ email, password, companyId }); // ✅ Pass it to the service

    // Optional soft-delete check
    if (!result.user.isActive) {
      res.status(403).json({ message: 'Account is deactivated' });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
