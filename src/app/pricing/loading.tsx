import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="py-16 md:py-24 border-b border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Pricing Cards Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="text-center pb-8">
                  <Skeleton className="h-8 w-24 mx-auto mb-4" />
                  <Skeleton className="h-12 w-32 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex gap-3">
                      <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                      <Skeleton className="h-5 flex-1" />
                    </div>
                  ))}
                </div>
                <div className="pt-8">
                  <Skeleton className="h-12 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
