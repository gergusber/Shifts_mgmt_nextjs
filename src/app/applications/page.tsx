'use client';

import { useUser } from '@/contexts/UserContext';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApplicationsPage() {
  const { currentUser } = useUser();
  const { data: applications, isLoading, error } = useApplications(currentUser?.id);

  if (!currentUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No User Selected</h2>
          <p className="mt-2 text-muted-foreground">
            Please select a user from the header to view applications
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive">
            Error Loading Applications
          </h2>
          <p className="mt-2 text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load applications'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your shift applications
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : applications && applications.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse available shifts and apply to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
