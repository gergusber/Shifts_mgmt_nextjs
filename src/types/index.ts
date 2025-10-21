export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Shift {
  id: string;
  title: string;
  description?: string;
  facilityName: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  hourlyRateCents: number;
  status: 'OPEN' | 'HIRED' | 'CANCELLED';
  hiredProviderId?: string;
  userHasApplied?: boolean;
  applications?: Application[];
}

export interface Application {
  id: string;
  shiftId: string;
  userId: string;
  status: 'APPLIED' | 'WITHDRAWN' | 'REJECTED' | 'HIRED';
  createdAt: string;
  shift?: Shift;
  user?: User;
}
