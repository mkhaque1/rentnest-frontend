import { ShieldCheck, Clock, Star } from 'lucide-react';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Verified listings',
    body: 'Every property is reviewed before going live. No scams, no surprises.',
  },
  {
    icon: Clock,
    title: 'Fast responses',
    body: 'Landlords on RentNest respond within hours, not days.',
  },
  {
    icon: Star,
    title: 'Real reviews',
    body: 'Read honest ratings from past tenants before making any decision.',
  },
];

export function TrustSection() {
  return (
    <section className='mx-auto max-w-6xl px-6 py-20'>
      <div className='mb-12'>
        <p className='text-xs font-semibold text-accent uppercase tracking-widest mb-2'>
          Why us
        </p>
        <h2 className='text-display text-3xl'>Built for trust</h2>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <div key={title} className='flex gap-4'>
            <div className='h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5'>
              <Icon className='h-5 w-5 text-accent' />
            </div>
            <div>
              <h3 className='text-heading text-base'>{title}</h3>
              <p className='text-body text-sm mt-1'>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
