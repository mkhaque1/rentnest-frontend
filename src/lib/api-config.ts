export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'https://rentnest-bakend.vercel.app'
).replace(/\/$/, '');
