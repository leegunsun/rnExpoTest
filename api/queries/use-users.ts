import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import type { User, PaginatedResponse } from '../types';

/**
 * Query Keys
 * Centralized query key management for better type safety and invalidation
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...userKeys.lists(), { page, limit }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Fetch users list with pagination
 * @param page - Page number (starts from 1)
 * @param limit - Items per page
 */
async function fetchUsers(page: number, limit: number): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>('/users', {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Hook: useUsers
 *
 * Fetches paginated list of users.
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const { data, isLoading, error } = useUsers(1, 10);
 *
 *   if (isLoading) return <ActivityIndicator />;
 *   if (error) return <Text>Error: {error.message}</Text>;
 *
 *   return (
 *     <FlatList
 *       data={data?.data}
 *       renderItem={({ item }) => <Text>{item.name}</Text>}
 *     />
 *   );
 * }
 * ```
 */
export function useUsers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: userKeys.list(page, limit),
    queryFn: () => fetchUsers(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data, // Optional: transform data here
  });
}

/**
 * Fetch single user by ID
 */
async function fetchUserById(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

/**
 * Hook: useUser
 *
 * Fetches a single user by ID.
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data: user, isLoading, error } = useUser(userId);
 *
 *   if (isLoading) return <ActivityIndicator />;
 *   if (error) return <Text>User not found</Text>;
 *
 *   return (
 *     <View>
 *       <Text>{user?.name}</Text>
 *       <Text>{user?.email}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Only fetch if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
