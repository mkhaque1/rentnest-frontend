import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];
  const price = Number(property.price).toLocaleString();

  return (
    <Link
      href={`/properties/${property.id}`}
      className='group block rounded-xl border border-border bg-card surface-edge overflow-hidden transition-colors hover:border-primary/40'
    >
      {/* Cover image */}
      <div className='relative h-48 bg-secondary flex items-center justify-center'>
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        ) : (
          <BedDouble className='h-8 w-8 text-muted-foreground/40' />
        )}
        <Badge className='absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-sm border border-border capitalize z-10'>
          {property.category.name}
        </Badge>
      </div>

      <div className='p-4 space-y-2'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='text-heading text-base line-clamp-1'>
            {property.title}
          </h3>
        </div>

        <div className='flex items-center gap-1.5 text-muted-foreground text-caption'>
          <MapPin className='h-3.5 w-3.5' />
          <span className='line-clamp-1'>{property.location}</span>
        </div>

        <div className='flex items-baseline gap-1 pt-1'>
          <span className='text-heading text-xl'>৳{price}</span>
          <span className='text-muted-foreground text-caption'>/mo</span>
        </div>
      </div>
    </Link>
  );
}
