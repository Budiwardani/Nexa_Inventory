import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginValues) => {
      const response = await api.post('/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.token) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate('/');
      }
    },
    onError: (error: any) => {
      console.error('Login error', error.response?.data || error.message);
      form.setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to login',
      });
    },
  });

  const onSubmit = (data: LoginValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/95">
      <CardHeader className="space-y-4 px-8 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 shadow-sm shadow-sky-500/20 dark:text-sky-300">
          <span className="text-lg font-semibold">NM</span>
        </div>
        <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Nexa-MFG</CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
          Sign in to continue to your manufacturing control center.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 px-8 pt-6 pb-4">
          {form.formState.errors.root && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200" role="alert" aria-live="assertive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="superadmin@nexa-mfg.com"
              {...form.register('email')}
              className={form.formState.errors.email ? 'border-red-400 ring-red-100 focus:border-red-500 focus:ring-red-100' : ''}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600 dark:text-red-300">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...form.register('password')}
              className={form.formState.errors.password ? 'border-red-400 ring-red-100 focus:border-red-500 focus:ring-red-100' : ''}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-600 dark:text-red-300">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-400">
            <label className="inline-flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600"
              />
              Remember me
            </label>
            <span className="italic">Need help? contact support</span>
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-10 pt-0">
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
