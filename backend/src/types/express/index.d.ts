// backend/src/types/express/index.d.ts
import { UserPayload } from '../auth'; // 👈 adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
