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
import { getApiErrorMessage } from '@/lib/api-error';

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
    const selectedCategory = categories?.find(
      (category) => category.id === values.categoryId,
    );

    if (!selectedCategory) {
      toast.error('Please select a valid category');
      return;
    }

    mutate(
      {
        ...values,
        type: selectedCategory.name,
        amenities: values.amenities
          ? values.amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
      },
      {
        onSuccess: () => {
          toast.success('Property updated');
          router.push('/dashboard/landlord');
        },
        onError: (err: unknown) => {
          toast.error(getApiErrorMessage(err, 'Failed to update property'));
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
              categoryId: property.categoryId,
              amenities: property.amenities?.join(', '),
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
