# API Layer - React Query + Axios Integration

Complete API layer implementation using React Query v5 and Axios for React Native with Expo.

## 📚 Documentation Sources

This implementation follows official documentation:
- **React Query v5**: [TanStack Query - React Native](https://tanstack.com/query/v5/docs/framework/react/react-native)
- **Axios**: [Axios Official Docs](https://axios-http.com/docs/intro)

## 🏗️ Architecture

```
/api
├── client.ts           # Axios instance with interceptors
├── query-client.ts     # React Query configuration
├── types.ts            # TypeScript type definitions
├── queries/            # Query and mutation hooks
│   ├── use-users.ts    # User-related queries
│   └── use-posts.ts    # Post-related queries and mutations
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Basic Query (GET Request)

```tsx
import { useUsers } from '@/api/queries/use-users';

function UserList() {
  const { data, isLoading, error, refetch } = useUsers(1, 10);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data?.data}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
}
```

### 2. Mutation (POST/PUT/DELETE)

```tsx
import { useCreatePost } from '@/api/queries/use-posts';

function CreatePostForm() {
  const createPost = useCreatePost();

  const handleSubmit = () => {
    createPost.mutate(
      { title: 'Hello', content: 'World' },
      {
        onSuccess: () => Alert.alert('Success!'),
        onError: (error) => Alert.alert('Error', error.message),
      }
    );
  };

  return (
    <Button
      title="Create Post"
      onPress={handleSubmit}
      disabled={createPost.isPending}
    />
  );
}
```

## 🔧 Configuration

### API Base URL

Edit `api/client.ts` to set your API base URL:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'     // Development
  : 'https://api.example.com';       // Production
```

### Authentication

Tokens are automatically managed using AsyncStorage:

```typescript
import { setAuthToken, clearAuthTokens } from '@/api/client';

// After login
await setAuthToken(accessToken);

// After logout
await clearAuthTokens();
```

The request interceptor automatically adds the Bearer token to all requests.

### Query Client Options

Default React Query settings in `api/query-client.ts`:

```typescript
{
  staleTime: 60 * 1000,        // 1 minute
  gcTime: 5 * 60 * 1000,       // 5 minutes
  retry: 2,
  refetchOnReconnect: true,
}
```

## 📝 Creating New Queries

### Step 1: Define Types

Add your types to `api/types.ts`:

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### Step 2: Create Query Keys

```typescript
// api/queries/use-todos.ts
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filter: string) => [...todoKeys.lists(), filter] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};
```

### Step 3: Create Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

async function fetchTodos(): Promise<Todo[]> {
  const response = await apiClient.get<Todo[]>('/todos');
  return response.data;
}

export function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: fetchTodos,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

### Step 4: Create Mutation Hook

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createTodo(input: { title: string }): Promise<Todo> {
  const response = await apiClient.post<Todo>('/todos', input);
  return response.data;
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}
```

## 🎯 Features

### ✅ Automatic Features

- **Network Status**: Automatic refetch on reconnect
- **Authentication**: Automatic Bearer token injection
- **Token Refresh**: Automatic token refresh on 401 errors
- **Caching**: Intelligent caching with stale-while-revalidate
- **Error Handling**: Centralized error handling with interceptors
- **Type Safety**: Full TypeScript support

### 🔄 Query Features

- **Automatic Refetching**: On reconnect, mount, or window focus
- **Pagination**: Built-in pagination support
- **Infinite Queries**: For infinite scroll patterns
- **Optimistic Updates**: Update UI before server response
- **Query Invalidation**: Automatic cache invalidation

### 🚀 Mutation Features

- **Loading States**: `isPending`, `isSuccess`, `isError`
- **Callbacks**: `onSuccess`, `onError`, `onSettled`
- **Automatic Invalidation**: Refresh related queries
- **Retry Logic**: Configurable retry on failure

## 🐛 Debugging

### Enable React Query Devtools (Optional)

```bash
npm install @tanstack/react-query-devtools
```

Then in `app/_layout.tsx`:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

### Console Logging

Request/response logging is enabled in development mode in `api/client.ts`.

## 📖 Examples

See complete working examples in:
- `components/examples/UserListExample.tsx` - Query with pagination
- `components/examples/CreatePostExample.tsx` - Mutation with form

## 🔗 Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query React Native Guide](https://tanstack.com/query/v5/docs/framework/react/react-native)
- [Axios Documentation](https://axios-http.com/)
- [Query Key Management Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)

## 💡 Best Practices

1. **Query Keys**: Use factory functions for consistent keys
2. **Error Handling**: Always handle errors in UI
3. **Loading States**: Show loading indicators during mutations
4. **Invalidation**: Invalidate related queries after mutations
5. **Stale Time**: Set appropriate `staleTime` based on data freshness needs
6. **Retry Logic**: Configure retry based on operation criticality
7. **Type Safety**: Always define TypeScript types for API responses

## 🚨 Common Issues

### Issue: "Network request failed"

**Solution**: Check API base URL and ensure server is running.

### Issue: 401 Unauthorized

**Solution**: Verify token storage and refresh logic in `api/client.ts`.

### Issue: Queries not refetching

**Solution**: Check `staleTime` and `gcTime` settings in query options.

### Issue: Mutations not invalidating queries

**Solution**: Ensure query keys match between queries and invalidation calls.

## 📄 License

Part of the main project. See root LICENSE file.
