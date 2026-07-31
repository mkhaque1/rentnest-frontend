import { Search, MessageSquare, HomeIcon } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Browse listings',
    body: 'Filter by location, price, category, and more. Every listing is verified by our team.',
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Request & message',
    body: 'Send a rental request with your move-in date. The landlord reviews and responds quickly.',
  },
  {
    step: '03',
    icon: HomeIcon,
    title: 'Move in',
    body: "Once approved, complete payment securely and get your keys. That's it.",
  },
];

export function HowItWorks() {
  return (
    <section className='bg-secondary/40 border-y border-border py-20'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='mb-12'>
          <p className='text-xs font-semibold text-accent uppercase tracking-widest mb-2'>
            How it works
          </p>
          <h2 className='text-display text-3xl'>Renting made simple</h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {STEPS.map(({ step, icon: Icon, title, body }) => (
            <div
              key={step}
              className='bg-card border border-border rounded-2xl p-6 surface-edge space-y-4'
            >
              <div className='flex items-center justify-between'>
                <div className='h-10 w-10 rounded-xl bg-secondary flex items-center justify-center'>
                  <Icon className='h-5 w-5 text-primary' />
                </div>
                <span className='text-display text-3xl text-muted-foreground/20 font-black'>
                  {step}
                </span>
              </div>
              <div>
                <h3 className='text-heading text-base'>{title}</h3>
                <p className='text-body text-sm mt-1'>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
