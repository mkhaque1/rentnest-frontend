'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyForm } from '@/features/properties/components/property-form';
import { useUpdateProperty } from '@/features/properties/hooks/use-property-mutations';
import { PropertyInput } from '@/features/properties/schemas/property-schema';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { PropertyCategory, Property } from '@/types/property';

function sanitizeImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/_next/image') {
      const original = parsed.searchParams.get('url');
      if (original) return decodeURIComponent(original);
    }
  } catch {
    // not a valid URL
  }
  return url;
}

function parseImages(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(',').map((u) => sanitizeImageUrl(u.trim())).filter(Boolean);
}

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { mutate, isPending } = useUpdateProperty(id);

  const { data: property, isLoading } = useQuery({
    queryKey: ['properties', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property>>(
        `/api/properties/${id}`,
      );
      return res.data.data;
    },
  });

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
          ? values.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        images: parseImages(values.images),
      },
      {
        onSuccess: () => {
          toast.success('Property updated');
          router.push('/dashboard/landlord');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ?? 'Failed to update property',
          );
        },
      },
    );
  }

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-lg px-6 py-12 min-h-[60vh]'>
        <h1 className='text-display text-2xl mb-6'>Edit property</h1>
        {isLoading && <Skeleton className='h-96 rounded-xl' />}
        {property && (
          <PropertyForm
            categories={categories ?? []}
            defaultValues={{
              title: property.title,
              description: property.description,
              location: property.location,
              price: Number(property.price),
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              categoryId: property.categoryId,
              amenities: property.amenities?.join(', '),
              images: property.images?.join(', '),
            }}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel='Save changes'
          />
        )}
      </main>
      <Footer />
    </>
  );
}
