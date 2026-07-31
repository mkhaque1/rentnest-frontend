import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble, Bath } from 'lucide-react';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];
  const price = Number(property.price).toLocaleString();
  const isAvailable = property.status === 'AVAILABLE';
  const bedrooms = property.bedrooms ?? 0;
  const bathrooms = property.bathrooms ?? 0;

  return (
    <Link
      href={`/properties/${property.id}`}
      className='group block rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15)] surface-edge'
    >
      {/* Image */}
      <div className='relative h-52 bg-secondary overflow-hidden'>
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <BedDouble className='h-10 w-10 text-muted-foreground/20' />
          </div>
        )}

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />

        {/* Top badges */}
        <div className='absolute top-3 left-3 right-3 flex items-start justify-between'>
          <span className='text-xs font-medium bg-background/80 backdrop-blur-sm border border-border text-foreground px-2.5 py-1 rounded-full'>
            {property.category.name}
          </span>
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm',
              isAvailable
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                : 'bg-black/40 border-white/10 text-white/60',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', isAvailable ? 'bg-emerald-400' : 'bg-white/40')} />
            {isAvailable ? 'Available' : 'Rented'}
          </span>
        </div>

        {/* Bottom price overlay */}
        <div className='absolute bottom-3 left-3'>
          <p className='text-white font-bold text-lg leading-none drop-shadow'>
            ৳{price}
            <span className='text-white/70 font-normal text-xs ml-1'>/mo</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className='p-4'>
        <h3 className='text-heading text-sm line-clamp-1 mb-1.5'>{property.title}</h3>

        <div className='flex items-center gap-1 text-xs text-muted-foreground mb-3'>
          <MapPin className='h-3 w-3 shrink-0' />
          <span className='line-clamp-1'>{property.location}</span>
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-border'>
          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <BedDouble className='h-3.5 w-3.5' />
              {bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}
            </span>
            <span className='flex items-center gap-1'>
              <Bath className='h-3.5 w-3.5' />
              {bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}
            </span>
          </div>
          <span className='text-xs text-muted-foreground group-hover:text-foreground transition-colors'>
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
