import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

interface Category {
  id: string;
  name: string;
}

export default async function Home() {
  const res = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
  const categories = res.data.data;

  return (
    <main className='p-12 min-h-screen'>
      <h1 className='text-display text-3xl mb-4'>
        Test Categories from live backend
      </h1>
      <ul className='text-body space-y-1'>
        {categories.map((c) => (
          <li className=' list-disc' key={c.id}>
            {c.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
