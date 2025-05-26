// backend/src/types/auth.d.ts
export interface UserPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
  companies?: string[]; // optional if user belongs to multiple
  currentCompany?: string;
  isSelfPaid?: boolean;
  isPaid?: boolean;
}
