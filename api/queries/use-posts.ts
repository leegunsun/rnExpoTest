import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import type { Post, PaginatedResponse, ApiResponse } from '../types';

/**
 * Query Keys for Posts
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...postKeys.lists(), { page, limit }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

/**
 * Fetch posts list
 */
async function fetchPosts(page: number, limit: number): Promise<PaginatedResponse<Post>> {
  const response = await apiClient.get<PaginatedResponse<Post>>('/posts', {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Hook: usePosts
 *
 * Fetches paginated list of posts.
 */
export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: postKeys.list(page, limit),
    queryFn: () => fetchPosts(page, limit),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Create post payload
 */
export interface CreatePostInput {
  title: string;
  content: string;
}

/**
 * Create new post
 */
async function createPost(input: CreatePostInput): Promise<Post> {
  const response = await apiClient.post<ApiResponse<Post>>('/posts', input);
  return response.data.data;
}

/**
 * Hook: useCreatePost
 *
 * Mutation hook for creating a new post.
 * Automatically invalidates post queries after successful creation.
 *
 * @example
 * ```tsx
 * function CreatePostForm() {
 *   const createPost = useCreatePost();
 *   const [title, setTitle] = useState('');
 *   const [content, setContent] = useState('');
 *
 *   const handleSubmit = () => {
 *     createPost.mutate(
 *       { title, content },
 *       {
 *         onSuccess: () => {
 *           Alert.alert('Success', 'Post created!');
 *           setTitle('');
 *           setContent('');
 *         },
 *         onError: (error) => {
 *           Alert.alert('Error', error.message);
 *         },
 *       }
 *     );
 *   };
 *
 *   return (
 *     <View>
 *       <TextInput value={title} onChangeText={setTitle} placeholder="Title" />
 *       <TextInput value={content} onChangeText={setContent} placeholder="Content" />
 *       <Button
 *         title="Create Post"
 *         onPress={handleSubmit}
 *         disabled={createPost.isPending}
 *       />
 *       {createPost.isPending && <ActivityIndicator />}
 *     </View>
 *   );
 * }
 * ```
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate all post list queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Failed to create post:', apiError);
    },
  });
}

/**
 * Update post payload
 */
export interface UpdatePostInput {
  id: string;
  title?: string;
  content?: string;
}

/**
 * Update existing post
 */
async function updatePost(input: UpdatePostInput): Promise<Post> {
  const { id, ...data } = input;
  const response = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, data);
  return response.data.data;
}

/**
 * Hook: useUpdatePost
 *
 * Mutation hook for updating an existing post.
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      // Invalidate specific post query
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.id) });
      // Invalidate post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Delete post
 */
async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}`);
}

/**
 * Hook: useDeletePost
 *
 * Mutation hook for deleting a post.
 *
 * @example
 * ```tsx
 * function PostItem({ post }: { post: Post }) {
 *   const deletePost = useDeletePost();
 *
 *   const handleDelete = () => {
 *     Alert.alert(
 *       'Delete Post',
 *       'Are you sure?',
 *       [
 *         { text: 'Cancel', style: 'cancel' },
 *         {
 *           text: 'Delete',
 *           style: 'destructive',
 *           onPress: () => {
 *             deletePost.mutate(post.id, {
 *               onSuccess: () => Alert.alert('Deleted!'),
 *             });
 *           },
 *         },
 *       ]
 *     );
 *   };
 *
 *   return (
 *     <View>
 *       <Text>{post.title}</Text>
 *       <Button title="Delete" onPress={handleDelete} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate all post queries
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
