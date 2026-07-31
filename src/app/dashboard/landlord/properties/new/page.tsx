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
