'use client';

import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { PropertyCategory } from '@/types/property';
import { PropertyFilters } from '../hooks/use-properties';
import { cn } from '@/lib/utils';

interface Props {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

export function PropertyFiltersBar({ filters, onChange }: Props) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PropertyCategory[]>>('/api/categories');
      return res.data.data;
    },
  });

  const hasActiveFilters =
    filters.location || filters.minPrice || filters.maxPrice || filters.categoryId || filters.type;

  function clearAll() {
    onChange({});
  }

  // Resolve active category label for pill display
  const activeCategoryId = filters.categoryId ??
    (filters.type
      ? categories?.find((c) => c.name.toLowerCase() === filters.type?.toLowerCase())?.id
      : undefined);

  return (
    <div className='space-y-4 mb-8'>
      {/* Search + price row */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1 sm:max-w-xs'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
          <Input
            placeholder='Search by location…'
            value={filters.location ?? ''}
            onChange={(e) => onChange({ ...filters, location: e.target.value || undefined })}
            className='pl-9 h-10 rounded-xl'
          />
        </div>

        <div className='flex gap-2'>
          <Input
            type='number'
            placeholder='Min ৳'
            value={filters.minPrice ?? ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value || undefined })}
            className='w-28 h-10 rounded-xl'
          />
          <Input
            type='number'
            placeholder='Max ৳'
            value={filters.maxPrice ?? ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value || undefined })}
            className='w-28 h-10 rounded-xl'
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearAll}
            className='h-10 rounded-xl gap-1.5 text-muted-foreground hover:text-foreground'
          >
            <X className='h-3.5 w-3.5' />
            Clear
          </Button>
        )}
      </div>

      {/* Category pills */}
      {categories && categories.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap'>
          <button
            onClick={() => onChange({ ...filters, categoryId: undefined, type: undefined })}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
              !activeCategoryId
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onChange({ ...filters, categoryId: cat.id, type: undefined })
              }
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
                activeCategoryId === cat.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
