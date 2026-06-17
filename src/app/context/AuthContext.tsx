import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'farmer' | 'credit' | 'compliance' | 'sanction' | 'treasury' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  mobile: string;
  avatar?: string;
  folioNo?: string;
  memberSince?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

const mockUsers: Record<UserRole, User> = {
  farmer: {
    id: 'USR001',
    name: 'Ramesh Patil',
    role: 'farmer',
    roleLabel: 'Borrower',
    email: 'ramesh.patil@email.com',
    mobile: '9876543210',
    folioNo: 'SH-04821',
    memberSince: '2019',
  },
  credit: {
    id: 'USR002',
    name: 'Priya Deshmukh',
    role: 'credit',
    roleLabel: 'Credit Manager',
    email: 'priya.d@sfpcl.com',
    mobile: '9876543211',
  },
  compliance: {
    id: 'USR003',
    name: 'Vikram Kulkarni',
    role: 'compliance',
    roleLabel: 'Company Secretary',
    email: 'vikram.k@sfpcl.com',
    mobile: '9876543212',
  },
  sanction: {
    id: 'USR004',
    name: 'Anjali Mehta',
    role: 'sanction',
    roleLabel: 'CFO',
    email: 'anjali.m@sfpcl.com',
    mobile: '9876543213',
  },
  treasury: {
    id: 'USR005',
    name: 'Suresh Nair',
    role: 'treasury',
    roleLabel: 'Sr. Manager – Finance',
    email: 'suresh.n@sfpcl.com',
    mobile: '9876543214',
  },
  admin: {
    id: 'USR006',
    name: 'Admin User',
    role: 'admin',
    roleLabel: 'System Admin',
    email: 'admin@sfpcl.com',
    mobile: '9876543215',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { mockUsers };
