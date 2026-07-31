'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyForm } from '@/features/properties/components/property-form';
import { useCreateProperty } from '@/features/properties/hooks/use-property-mutations';
import { PropertyInput } from '@/features/properties/schemas/property-schema';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { PropertyCategory } from '@/types/property';
import { getApiErrorMessage } from '@/lib/api-error';

/** Strip Next.js image proxy wrapper back to the original URL */
function sanitizeImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/_next/image') {
      const original = parsed.searchParams.get('url');
      if (original) return decodeURIComponent(original);
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url;
}

function parseImages(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((u) => sanitizeImageUrl(u.trim()))
    .filter(Boolean);
}

export default function NewPropertyPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateProperty();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<PropertyCategory[]>>('/api/categories');
      return res.data.data;
    },
  });

  function handleSubmit(values: PropertyInput) {
    mutate(
      {
        ...values,
        amenities: values.amenities
          ? values.amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        images: parseImages(values.images),
      },
      {
        onSuccess: () => {
          toast.success('Property created');
          router.push('/dashboard/landlord');
        },
        onError: (err: unknown) => {
          toast.error(getApiErrorMessage(err, 'Failed to create property'));
        },
      },
    );
  }

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-lg px-6 py-12 min-h-[60vh]'>
        <h1 className='text-display text-2xl mb-6'>List a new property</h1>
        <PropertyForm
          categories={categories ?? []}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel='Create property'
        />
      </main>
      <Footer />
    </>
  );
}
