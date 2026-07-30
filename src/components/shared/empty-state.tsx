export function EmptyState({ message }: { message: string }) {
  return (
    <div className='border border-dashed border-border rounded-xl py-16 text-center'>
      <p className='text-body'>{message}</p>
    </div>
  );
}
