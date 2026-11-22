import { createContext } from 'react';
import type { User, LoginRequest } from '../types/api';

export interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);