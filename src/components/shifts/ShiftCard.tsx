'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApplyToShift } from '@/hooks/useApplyToShift';
import { useUser } from '@/contexts/UserContext';
import type { Shift } from '@/types';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: Shift;
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ShiftCard({ shift }: ShiftCardProps) {
  const { currentUser } = useUser();
  const applyMutation = useApplyToShift();

  const startDate = new Date(shift.startsAt);
  const endDate = new Date(shift.endsAt);

  const handleApply = () => {
    if (!currentUser) {
      return;
    }
    applyMutation.mutate({
      shiftId: shift.id,
      userId: currentUser.id,
    });
  };

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
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{shift.title}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{shift.facilityName}</span>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(shift.status)}>
            {shift.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {shift.description && (
          <p className="text-sm text-muted-foreground">{shift.description}</p>
        )}

        <div className="grid gap-2 text-sm">
          {shift.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{shift.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(startDate, 'PPP')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>

          <div className="flex items-center gap-2 font-semibold text-green-600">
            <DollarSign className="h-4 w-4" />
            <span>{formatCurrency(shift.hourlyRateCents)}/hour</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link href={`/shifts/${shift.id}`}>
            <Button variant="outline" className="w-full">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {shift.userHasApplied ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Applied</span>
            </div>
          ) : shift.status === 'OPEN' && currentUser ? (
            <Button
              onClick={handleApply}
              disabled={applyMutation.isPending}
              className="w-full"
            >
              {applyMutation.isPending ? 'Applying...' : 'Apply to Shift'}
            </Button>
          ) : !currentUser ? (
            <p className="text-center text-sm text-muted-foreground">
              Select a user to apply
            </p>
          ) : (
            <Button disabled className="w-full">
              Not Available
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
