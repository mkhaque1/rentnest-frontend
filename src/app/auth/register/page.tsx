import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/register-form';

export default function RegisterPage() {
  return (
    <main className='min-h-screen flex items-center justify-center px-6'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center'>
          <h1 className='text-heading text-5xl mb-5'>RentNest</h1>
          <h2 className='text-lg font-semibold'>Create your account</h2>
          <p className='text-body text-sm mt-1'>
            Start browsing or listing in minutes
          </p>
        </div>
        <RegisterForm />
        <p className='text-caption text-muted-foreground text-center'>
          Already have an account?{' '}
          <Link href='/auth/login' className='text-foreground hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
