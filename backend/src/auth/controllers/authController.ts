import { Request, Response } from 'express';
import { loginUserService } from '../services/authService';

/**
 * Controller: Handle login and return JWT + user context (no userId exposed)
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const result = await loginUserService({ email, password });

    if (!result.user.isActive) {
      res.status(403).json({ message: 'Account is deactivated' });
      return;
    }

    res.status(200).json({
      token: result.token,
      user: {
        email: result.user.email,
        role: result.user.role,
        isSelfPaid: result.user.isSelfPaid,
        currentCompany: result.user.currentCompany,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
