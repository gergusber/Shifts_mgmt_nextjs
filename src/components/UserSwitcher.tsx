'use client';

import { useUser } from '@/contexts/UserContext';
import { useUsers } from '@/hooks/useUsers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCircle } from 'lucide-react';

export function UserSwitcher() {
  const { currentUser, setCurrentUser } = useUser();
  const { data: users, isLoading } = useUsers();

  const handleUserChange = (userId: string) => {
    const selected = users?.find((u) => u.id === userId);
    setCurrentUser(selected || null);
  };

  if (isLoading) {
    return <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />;
  }

  return (
    <div className="flex items-center gap-2">
      <UserCircle className="h-5 w-5 text-muted-foreground" />
      <Select
        value={currentUser?.id || ''}
        onValueChange={handleUserChange}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
