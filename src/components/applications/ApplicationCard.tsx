'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWithdrawApplication } from '@/hooks/useWithdrawApplication';
import { useUser } from '@/contexts/UserContext';
import type { Application } from '@/types';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Building2,
} from 'lucide-react';
import { format } from 'date-fns';

interface ApplicationCardProps {
  application: Application;
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { currentUser } = useUser();
  const withdrawMutation = useWithdrawApplication();

  if (!application.shift) {
    return null;
  }

  const { shift } = application;
  const startDate = new Date(shift.startsAt);
  const endDate = new Date(shift.endsAt);

  const handleWithdraw = () => {
    if (!currentUser) return;
    withdrawMutation.mutate({
      applicationId: application.id,
      userId: currentUser.id,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'default';
      case 'HIRED':
        return 'default';
      case 'WITHDRAWN':
        return 'secondary';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const canWithdraw = application.status === 'APPLIED';

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
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {application.status}
            </Badge>
            {shift.status !== 'OPEN' && (
              <Badge variant="secondary" className="text-xs">
                {shift.status}
              </Badge>
            )}
          </div>
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

        <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <span>Applied {format(new Date(application.createdAt), 'PPp')}</span>
        </div>

        {canWithdraw && (
          <div className="pt-2">
            <Button
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {withdrawMutation.isPending ? 'Withdrawing...' : 'Withdraw Application'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
