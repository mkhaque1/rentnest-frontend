'use client';

import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { propertySchema, PropertyInput } from '../schemas/property-schema';
import { PropertyCategory } from '@/types/property';

interface Props {
  categories: PropertyCategory[];
  defaultValues?: Partial<PropertyInput>;
  onSubmit: (values: PropertyInput) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function PropertyForm({
  categories,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues,
  });

  const { field: categoryField } = useController({ name: 'categoryId', control });
  const { field: typeField }     = useController({ name: 'type',       control });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label htmlFor='title'>Title</Label>
        <Input id='title' {...register('title')} />
        {errors.title && (
          <p className='text-caption text-destructive'>{errors.title.message}</p>
        )}
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='description'>Description</Label>
        <Textarea id='description' rows={4} {...register('description')} />
        {errors.description && (
          <p className='text-caption text-destructive'>{errors.description.message}</p>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='location'>Location</Label>
          <Input id='location' {...register('location')} />
          {errors.location && (
            <p className='text-caption text-destructive'>{errors.location.message}</p>
          )}
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='price'>Price / month (৳)</Label>
          <Input
            id='price'
            type='number'
            step='1'
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className='text-caption text-destructive'>{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* Type — free text e.g. "apartment", "villa" */}
        <div className='space-y-1.5'>
          <Label htmlFor='type'>Property type</Label>
          <Input
            id='type'
            placeholder='e.g. apartment, villa'
            value={typeField.value ?? ''}
            onChange={typeField.onChange}
          />
          {errors.type && (
            <p className='text-caption text-destructive'>{errors.type.message}</p>
          )}
        </div>

        {/* Category — from API */}
        <div className='space-y-1.5'>
          <Label>Category</Label>
          <Select value={categoryField.value} onValueChange={categoryField.onChange}>
            <SelectTrigger>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className='text-caption text-destructive'>{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='amenities'>Amenities (comma-separated)</Label>
        <Input
          id='amenities'
          placeholder='WiFi, Parking, Lift'
          {...register('amenities')}
        />
      </div>

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
