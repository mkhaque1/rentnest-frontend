'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Tab = 'login' | 'register';
type Role = 'TENANT' | 'LANDLORD';

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<Role>('TENANT');

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Top bar */}
      <header className='px-6 py-4 flex items-center justify-between border-b border-border/50'>
        <Link
          href='/'
          className='flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground hover:text-foreground/80 transition-colors'
        >
          <Home className='h-4 w-4' />
          RentNest
        </Link>
        <span className='text-caption text-muted-foreground text-xs'>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className='text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors'
          >
            {tab === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </span>
      </header>

      {/* Center card */}
      <div className='flex flex-1 items-center justify-center px-4 py-16'>
        <div className='w-full max-w-sm'>

          {/* Heading */}
          <div className='mb-8'>
            <h1 className='text-display text-3xl mb-2'>
              {tab === 'login' ? 'Welcome back.' : 'Create account.'}
            </h1>
            <p className='text-body text-sm'>
              {tab === 'login'
                ? 'Sign in to manage your rentals and properties.'
                : 'Join RentNest to find or list properties.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className='flex items-center gap-1 p-1 rounded-xl bg-secondary mb-8'>
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                  tab === t
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <LoginForm showPassword={showPassword} onTogglePassword={() => setShowPassword((v) => !v)} />
          ) : (
            <RegisterForm
              showPassword={showPassword}
              showConfirm={showConfirm}
              onTogglePassword={() => setShowPassword((v) => !v)}
              onToggleConfirm={() => setShowConfirm((v) => !v)}
              role={role}
              onRoleChange={setRole}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Login form ─────────────────────────────────────────── */
function LoginForm({
  showPassword,
  onTogglePassword,
}: {
  showPassword: boolean;
  onTogglePassword: () => void;
}) {
  return (
    <form className='space-y-5' onSubmit={(e) => e.preventDefault()}>
      <Field label='Email address'>
        <Input
          type='email'
          placeholder='you@example.com'
          autoComplete='email'
          className='h-11 rounded-xl px-4'
        />
      </Field>

      <Field label='Password'>
        <PasswordInput
          placeholder='Your password'
          show={showPassword}
          onToggle={onTogglePassword}
          autoComplete='current-password'
        />
        <div className='flex justify-end mt-1.5'>
          <button
            type='button'
            className='text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4'
          >
            Forgot password?
          </button>
        </div>
      </Field>

      <Button type='submit' className='w-full h-11 rounded-xl mt-2' size='lg'>
        Sign in
      </Button>

      <Divider />

      <SocialButtons />
    </form>
  );
}

/* ─── Register form ──────────────────────────────────────── */
function RegisterForm({
  showPassword,
  showConfirm,
  onTogglePassword,
  onToggleConfirm,
  role,
  onRoleChange,
}: {
  showPassword: boolean;
  showConfirm: boolean;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  role: Role;
  onRoleChange: (r: Role) => void;
}) {
  return (
    <form className='space-y-5' onSubmit={(e) => e.preventDefault()}>
      {/* Role picker */}
      <div>
        <Label className='mb-2 text-muted-foreground text-xs uppercase tracking-widest'>
          I am a
        </Label>
        <div className='flex gap-2 mt-1'>
          {(['TENANT', 'LANDLORD'] as Role[]).map((r) => (
            <button
              key={r}
              type='button'
              onClick={() => onRoleChange(r)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
                role === r
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/80',
              )}
            >
              {r === 'TENANT' ? '🏠 Tenant' : '🔑 Landlord'}
            </button>
          ))}
        </div>
      </div>

      <Field label='Full name'>
        <Input
          type='text'
          placeholder='John Doe'
          autoComplete='name'
          className='h-11 rounded-xl px-4'
        />
      </Field>

      <Field label='Email address'>
        <Input
          type='email'
          placeholder='you@example.com'
          autoComplete='email'
          className='h-11 rounded-xl px-4'
        />
      </Field>

      <Field label='Phone number'>
        <Input
          type='tel'
          placeholder='+880 1X XX XXX XXX'
          autoComplete='tel'
          className='h-11 rounded-xl px-4'
        />
      </Field>

      <Field label='Password'>
        <PasswordInput
          placeholder='Min. 8 characters'
          show={showPassword}
          onToggle={onTogglePassword}
          autoComplete='new-password'
        />
      </Field>

      <Field label='Confirm password'>
        <PasswordInput
          placeholder='Repeat your password'
          show={showConfirm}
          onToggle={onToggleConfirm}
          autoComplete='new-password'
        />
      </Field>

      <p className='text-xs text-muted-foreground leading-relaxed'>
        By creating an account you agree to our{' '}
        <span className='text-foreground underline underline-offset-4 cursor-pointer hover:text-foreground/70 transition-colors'>
          Terms of Service
        </span>{' '}
        and{' '}
        <span className='text-foreground underline underline-offset-4 cursor-pointer hover:text-foreground/70 transition-colors'>
          Privacy Policy
        </span>
        .
      </p>

      <Button type='submit' className='w-full h-11 rounded-xl' size='lg'>
        Create account
      </Button>
    </form>
  );
}

/* ─── Reusable sub-components ────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <Label className='text-sm text-muted-foreground'>{label}</Label>
      {children}
    </div>
  );
}

function PasswordInput({
  show,
  onToggle,
  placeholder,
  autoComplete,
}: {
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className='relative'>
      <Input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className='h-11 rounded-xl px-4 pr-11'
      />
      <button
        type='button'
        onClick={onToggle}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex-1 h-px bg-border' />
      <span className='text-xs text-muted-foreground'>or continue with</span>
      <div className='flex-1 h-px bg-border' />
    </div>
  );
}

function SocialButtons() {
  return (
    <div className='grid grid-cols-2 gap-3'>
      <Button
        type='button'
        variant='outline'
        className='h-11 rounded-xl gap-2 text-sm'
      >
        {/* Google icon */}
        <svg className='h-4 w-4' viewBox='0 0 24 24' aria-hidden='true'>
          <path
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            fill='#4285F4'
          />
          <path
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            fill='#34A853'
          />
          <path
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
            fill='#FBBC05'
          />
          <path
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            fill='#EA4335'
          />
        </svg>
        Google
      </Button>
      <Button
        type='button'
        variant='outline'
        className='h-11 rounded-xl gap-2 text-sm'
      >
        {/* GitHub icon */}
        <svg className='h-4 w-4 fill-current' viewBox='0 0 24 24' aria-hidden='true'>
          <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
        </svg>
        GitHub
      </Button>
    </div>
  );
}
