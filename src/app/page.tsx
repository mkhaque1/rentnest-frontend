export default function Home() {
  return (
    <main className='p-12 space-y-4 min-h-screen'>
      <h1 className='text-display text-5xl'>Find your next home</h1>
      <p className='text-body max-w-md'>
        Browse verified listings, request a viewing, and move in — all in one
        place.
      </p>
      <button className='bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-caption font-medium'>
        Browse properties
      </button>
      <div className='bg-card surface-edge border border-border rounded-xl p-6 max-w-sm mt-8'>
        <span className='bg-accent text-accent-foreground text-caption px-2 py-1 rounded-full'>
          Verified
        </span>
        <p className='text-heading text-xl mt-3'>Cozy Downtown Apartment</p>
        <p className='text-body'>$1,200/mo · Downtown</p>
      </div>
    </main>
  );
}
