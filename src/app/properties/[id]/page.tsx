import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Tag, Layers, BedDouble, Bath, Ruler } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { RequestRentalButton } from '@/features/rentals/components/request-rental-button';
import { API_BASE_URL } from '@/lib/api-config';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json: ApiResponse<Property> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const amenities = property.amenities ?? [];

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-6xl px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          <div className='lg:col-span-2 space-y-6'>
            <div className='relative h-80 rounded-xl bg-card border border-border surface-edge overflow-hidden flex items-center justify-center'>
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 66vw'
                  priority
                  loading='eager'
                />
              ) : (
                <span className='text-muted-foreground text-caption'>
                  No image available
                </span>
              )}
            </div>

            <div>
              <Badge className='capitalize mb-3'>
                {property.category.name}
              </Badge>
              <h1 className='text-display text-3xl'>{property.title}</h1>
              <div className='flex items-center gap-1.5 text-muted-foreground text-caption mt-2'>
                <MapPin className='h-4 w-4' />
                {property.location}
              </div>
              <div className='flex items-center gap-4 mt-3 text-caption text-muted-foreground'></div>
            </div>

            <p className='text-body leading-relaxed'>{property.description}</p>

            {amenities.length > 0 && (
              <div>
                <h2 className='text-heading text-lg mb-3'>Amenities</h2>
                <div className='flex flex-wrap gap-2'>
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className='flex items-center gap-1.5 text-caption bg-secondary px-3 py-1.5 rounded-full'
                    >
                      <Tag className='h-3 w-3' />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.landlord && (
              <div className='flex items-center gap-2 text-caption text-muted-foreground pt-2'>
                <Layers className='h-4 w-4' />
                Listed by {property.landlord.name}
              </div>
            )}
          </div>

          <aside>
            <div className='sticky top-24 rounded-xl border border-border bg-card surface-edge p-6 space-y-4'>
              <div className='flex items-baseline gap-1'>
                <span className='text-display text-3xl'>
                  ৳{Number(property.price).toLocaleString()}
                </span>
                <span className='text-muted-foreground text-caption'>/mo</span>
              </div>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                    property.status === 'AVAILABLE'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-destructive/15 text-destructive border-destructive/30'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${property.status === 'AVAILABLE' ? 'bg-emerald-400' : 'bg-destructive'}`}
                  />
                  {property.status === 'AVAILABLE'
                    ? 'Available'
                    : 'Currently rented'}
                </span>
              </div>
              <RequestRentalButton
                propertyId={property.id}
                status={property.status}
              />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
