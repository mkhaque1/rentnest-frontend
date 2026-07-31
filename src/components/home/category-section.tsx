import Link from 'next/link';
import { Building2, HomeIcon, Layers, MapPin } from 'lucide-react';

const CATEGORIES = [
  { label: 'Apartment', icon: Building2, desc: 'City-centre flats'    },
  { label: 'House',     icon: HomeIcon,  desc: 'Standalone homes'     },
  { label: 'Studio',    icon: Layers,    desc: 'Compact smart spaces'  },
  { label: 'Room',      icon: MapPin,    desc: 'Shared & single rooms' },
];

export function CategorySection() {
  return (
    <section className='bg-secondary/40 border-y border-border py-20'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='mb-10'>
          <p className='text-xs font-semibold text-accent uppercase tracking-widest mb-2'>
            Categories
          </p>
          <h2 className='text-display text-3xl'>Browse by type</h2>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {CATEGORIES.map(({ label, icon: Icon, desc }) => (
            <Link
              key={label}
              href={`/properties?type=${label.toLowerCase()}`}
              className='group bg-card border border-border rounded-2xl p-5 surface-edge hover:border-primary/40 transition-colors space-y-3'
            >
              <div className='h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                <Icon className='h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors' />
              </div>
              <div>
                <p className='text-heading text-sm'>{label}</p>
                <p className='text-caption text-muted-foreground text-xs mt-0.5'>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
