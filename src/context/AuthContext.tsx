import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { STORAGE_KEYS } from '../lib/constants';
import { storage } from '../lib/utils';
import { MOCK_USER } from '../lib/mockData';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Mock Auth Functions ──────────────────────────────────────────────────────
const MOCK_TOKEN = 'mock_jwt_token_Todo-Calender_2024';
const MOCK_CREDENTIALS = { email: 'Tarun@Todo-Calender.io', password: 'password123' };
const REGISTERED_USERS_KEY = 'Todo-Calender_registered_users';

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount
  useEffect(() => {
    const token = storage.get<string | null>(STORAGE_KEYS.TOKEN, null);
    const user = storage.get<User | null>(STORAGE_KEYS.USER, null);

    if (token && user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check registered users first
      const registeredUsers = storage.get<Array<{email: string; password: string; user: User}>>(REGISTERED_USERS_KEY, []);
      const registeredUser = registeredUsers.find(u => u.email === credentials.email && u.password === credentials.password);

      let user: User;
      if (registeredUser) {
        user = registeredUser.user;
      } else if (credentials.email === MOCK_CREDENTIALS.email && credentials.password === MOCK_CREDENTIALS.password) {
        user = MOCK_USER;
      } else {
        throw new Error('Invalid email or password');
      }

      const token = MOCK_TOKEN;
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.USER, user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success(`Welcome back, ${user.name}! 👋`);
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (credentials.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const registeredUsers = storage.get<Array<{email: string; password: string; user: User}>>(REGISTERED_USERS_KEY, []);
      if (registeredUsers.some(u => u.email === credentials.email) || credentials.email === MOCK_CREDENTIALS.email) {
        throw new Error('Email already registered');
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        avatar: '',
        createdAt: new Date().toISOString(),
      };

      registeredUsers.push({ email: credentials.email, password: credentials.password, user: newUser });
      storage.set(REGISTERED_USERS_KEY, registeredUsers);

      const token = MOCK_TOKEN;
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.USER, newUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, token } });
      toast.success(`Welcome to Todo-Calender, ${newUser.name}! 🎉`);
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const logout = useCallback((): void => {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((userData: Partial<User>): void => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      storage.set(STORAGE_KEYS.USER, updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  }, [state.user]);

  const changePassword = useCallback(async (_currentPassword: string, _newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Password changed successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
