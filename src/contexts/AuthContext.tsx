
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Teacher {
  teacher_id: string;
  name: string;
  department: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  teacher: Teacher | null;
  login: (teacherId: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedTeacherId = sessionStorage.getItem('teacher_id');
    if (storedTeacherId) {
      fetchTeacherData(storedTeacherId)
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Error fetching teacher data:', error);
          sessionStorage.removeItem('teacher_id');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTeacherData = async (teacherId: string) => {
    try {
      // This would be a real API call in production
      // const response = await api.get(`/teacher/${teacherId}/`);
      // setTeacher(response.data);
      
      // Mock data for development
      setTeacher({
        teacher_id: teacherId,
        name: 'Dr. Jane Smith',
        department: 'Computer Science',
        email: 'jane.smith@college.edu'
      });
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      throw error;
    }
  };

  const login = async (teacherId: string) => {
    setLoading(true);
    try {
      // This would be a real API call in production
      // const response = await api.post('/login/', { teacher_id: teacherId });
      // if (response.status === 200) {
      
      // Mock login for development
      sessionStorage.setItem('teacher_id', teacherId);
      await fetchTeacherData(teacherId);
      setIsAuthenticated(true);
      navigate('/dashboard');
      // }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('teacher_id');
    setIsAuthenticated(false);
    setTeacher(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, teacher, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
