export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/products/:path*',
    '/my-products/:path*',
    '/my-bids/:path*',
    '/add-product/:path*',
  ],
};
