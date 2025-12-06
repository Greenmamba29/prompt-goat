import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GoatIcon } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <GoatIcon className="w-24 h-24 mx-auto mb-6 text-slate-700" />
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          Oops! The page you&apos;re looking for seems to have wandered off. 
          Even the GOAT can&apos;t find it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Link href="/prompts">
            <Button variant="outline">Browse Prompts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
