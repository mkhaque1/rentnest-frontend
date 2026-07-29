export type Role = 'TENANT' | 'LANDLORD' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone?: string;
  createdAt: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}
