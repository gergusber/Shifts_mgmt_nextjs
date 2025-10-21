'use client';

import { use } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { useShift } from '@/hooks/useShift';
import { useApplyToShift } from '@/hooks/useApplyToShift';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ShiftDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { currentUser } = useUser();
  const { data: shift, isLoading, error } = useShift(id, currentUser?.id);
  const applyMutation = useApplyToShift();

  const handleApply = () => {
    if (!currentUser || !shift) return;
    applyMutation.mutate({
      shiftId: shift.id,
      userId: currentUser.id,
    });
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive">
            Error Loading Shift
          </h2>
          <p className="mt-2 text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load shift'}
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shifts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !shift) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const startDate = new Date(shift.startsAt);
  const endDate = new Date(shift.endsAt);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'HIRED':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shifts
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Shift Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{shift.title}</CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span className="text-lg">{shift.facilityName}</span>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(shift.status)}>
                  {shift.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {shift.description && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <Briefcase className="h-4 w-4" />
                    Description
                  </h3>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {shift.description}
                  </p>
                </div>
              )}

              {/* Hired Provider */}
              {shift.status === 'HIRED' && shift.hiredProvider && (
                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                    <CheckCircle2 className="h-5 w-5" />
                    Shift Filled
                  </h3>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-700" />
                    <div>
                      <p className="font-medium text-green-900">{shift.hiredProvider.name}</p>
                      <p className="text-sm text-green-700">{shift.hiredProvider.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shift Details */}
              <div>
                <h3 className="mb-3 font-semibold">Shift Information</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {shift.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{shift.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{format(startDate, 'PPP')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hourly Rate</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(shift.hourlyRateCents)}/hour
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Apply to this Shift</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shift.userHasApplied ? (
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                  <p className="mt-2 font-medium text-green-900">
                    You&apos;ve applied to this shift
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Check your applications page for status
                  </p>
                </div>
              ) : shift.status === 'OPEN' && currentUser ? (
                <>
                  <div className="space-y-2 rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium">Ready to apply?</p>
                    <p className="text-sm text-muted-foreground">
                      Submit your application and the facility will review your
                      profile.
                    </p>
                  </div>
                  <Button
                    onClick={handleApply}
                    disabled={applyMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                  </Button>
                </>
              ) : !currentUser ? (
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Please select a user from the header to apply to this shift
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    This shift is no longer available
                  </p>
                </div>
              )}

              <div className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-medium">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {Math.abs((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Pay</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        shift.hourlyRateCents *
                          Math.abs((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
