
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId.trim()) {
      toast.error('Please enter your Teacher ID');
      return;
    }

    setLoading(true);
    try {
      await login(teacherId);
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">TeacherLinker</h1>
          <p className="text-muted-foreground mt-2">College Management System</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Teacher Login</CardTitle>
            <CardDescription>
              Enter your Teacher ID to access the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="teacherId" className="text-sm font-medium">
                    Teacher ID
                  </label>
                  <Input
                    id="teacherId"
                    placeholder="Enter your ID (e.g., T001)"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>For demo purposes, use Teacher ID: T001</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
