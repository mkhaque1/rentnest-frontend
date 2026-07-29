import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyDetailsLoading() {
  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-6xl px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          <div className='lg:col-span-2 space-y-6'>
            <Skeleton className='h-80 rounded-xl' />
            <Skeleton className='h-6 w-24 rounded-full' />
            <Skeleton className='h-9 w-2/3' />
            <Skeleton className='h-4 w-1/3' />
          </div>
          <Skeleton className='h-56 rounded-xl' />
        </div>
      </main>
      <Footer />
    </>
  );
}
