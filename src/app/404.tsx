// pages/404.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally, you can add a redirect after a few seconds to the homepage
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to the home page after 5 seconds (you can change this time)
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold">404 - Page Not Found</h1>
      <p className="text-xl mt-4">Sorry, the page you're looking for doesn't exist.</p>
      <p className="mt-6">Redirecting you to the home page...</p>
    </div>
  );
}
