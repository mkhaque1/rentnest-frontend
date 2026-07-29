'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROPERTY_TYPES } from '@/constants/property';
import { PropertyFilters } from '../hooks/use-properties';

interface Props {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

export function PropertyFiltersBar({ filters, onChange }: Props) {
  return (
    <div className='flex flex-col sm:flex-row gap-3 mb-8'>
      <Input
        placeholder='Location'
        value={filters.location ?? ''}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        className='sm:max-w-[220px]'
      />

      <Input
        type='number'
        placeholder='Min price'
        value={filters.minPrice ?? ''}
        onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
        className='sm:max-w-[140px]'
      />

      <Input
        type='number'
        placeholder='Max price'
        value={filters.maxPrice ?? ''}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
        className='sm:max-w-[140px]'
      />

      <Select
        value={filters.type ?? 'all'}
        onValueChange={(value) =>
          onChange({ ...filters, type: value === 'all' ? undefined : value })
        }
      >
        <SelectTrigger className='sm:max-w-[160px]'>
          <SelectValue placeholder='Property type' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All types</SelectItem>
          {PROPERTY_TYPES.map((type) => (
            <SelectItem key={type} value={type} className='capitalize'>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
