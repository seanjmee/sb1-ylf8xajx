import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../lib/store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

interface AuthPageProps {
  isLogin?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isLogin = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { login, signup, isLoading, error } = useUserStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate email and password
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedUsername = username.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      setFormError('Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (trimmedPassword.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      if (isLogin) {
        await login(trimmedEmail, trimmedPassword);
        navigate('/dashboard');
      } else {
        // Additional validation for signup
        if (!trimmedUsername) {
          setFormError('Please enter a username');
          return;
        }
        
        const success = await signup(trimmedEmail, trimmedPassword, trimmedUsername);
        if (success) {
          await login(trimmedEmail, trimmedPassword);
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">StravaGPT</h1>
          <p className="mt-2 text-sm text-gray-600">
            AI-powered training plans based on your Strava data
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Sign in to your account' : 'Create a new account'}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {(formError || error) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formError || error}
                </div>
              )}
              
              {!isLogin && (
                <div>
                  <Input
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                  />
                </div>
              )}
              
              <div>
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                >
                  {isLogin ? 'Sign in' : 'Sign up'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link
                  to={isLogin ? '/signup' : '/login'}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};