'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCreateShift } from '@/hooks/useCreateShift';
import { useUser } from '@/contexts/UserContext';
import { useUsers } from '@/hooks/useUsers';
import { ArrowLeft } from 'lucide-react';

const shiftSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  facilityName: z.string().min(1, 'Facility name is required'),
  location: z.string().optional(),
  startsAt: z.string().min(1, 'Start date/time is required'),
  endsAt: z.string().min(1, 'End date/time is required'),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
});

type ShiftFormData = z.infer<typeof shiftSchema>;

export default function CreateShiftPage() {
  const createShiftMutation = useCreateShift();
  const { currentUser, setCurrentUser } = useUser();
  const { data: users } = useUsers();

  // Automatically set admin user when entering this page
  useEffect(() => {
    if (users && !currentUser) {
      const admin = users.find((u) => u.email === 'admin@shiftrx.com');
      if (admin) {
        setCurrentUser(admin);
      }
    }
  }, [users, currentUser, setCurrentUser]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
  });

  const onSubmit = (data: ShiftFormData) => {
    createShiftMutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shifts
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Shift</h1>
        <p className="mt-2 text-muted-foreground">
          Post a new shift for healthcare providers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Shift Title <span className="text-destructive">*</span>
              </Label>
              <input
                id="title"
                {...register('title')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., Night Shift - Emergency Department"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Provide details about the shift, requirements, responsibilities..."
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Facility Name */}
            <div className="space-y-2">
              <Label htmlFor="facilityName">
                Facility Name <span className="text-destructive">*</span>
              </Label>
              <input
                id="facilityName"
                {...register('facilityName')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., City General Hospital"
              />
              {errors.facilityName && (
                <p className="text-sm text-destructive">{errors.facilityName.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <input
                id="location"
                {...register('location')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., San Francisco, CA"
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Start Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="startsAt">
                  Start Date & Time <span className="text-destructive">*</span>
                </Label>
                <input
                  id="startsAt"
                  type="datetime-local"
                  {...register('startsAt')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.startsAt && (
                  <p className="text-sm text-destructive">{errors.startsAt.message}</p>
                )}
              </div>

              {/* End Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="endsAt">
                  End Date & Time <span className="text-destructive">*</span>
                </Label>
                <input
                  id="endsAt"
                  type="datetime-local"
                  {...register('endsAt')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.endsAt && (
                  <p className="text-sm text-destructive">{errors.endsAt.message}</p>
                )}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                Hourly Rate ($) <span className="text-destructive">*</span>
              </Label>
              <input
                id="hourlyRate"
                type="number"
                step="0.01"
                {...register('hourlyRate')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., 85.00"
              />
              {errors.hourlyRate && (
                <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createShiftMutation.isPending} className="flex-1">
                {createShiftMutation.isPending ? 'Creating...' : 'Create Shift'}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
