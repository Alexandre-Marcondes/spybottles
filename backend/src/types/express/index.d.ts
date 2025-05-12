
export {}; // ✅ Required!

// backend/src/types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';


declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        role?: string;
        iat?: number;
        exp?: number;
      } & JwtPayload;
    }
  }
}
