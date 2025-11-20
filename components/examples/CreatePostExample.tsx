/**
 * Create Post Example Component
 *
 * Demonstrates React Query + Axios mutations:
 * - useMutation for POST requests
 * - Form state management
 * - Loading states during mutation
 * - Success and error handling
 * - Automatic query invalidation
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useCreatePost } from '@/api/queries/use-posts';

export function CreatePostExample() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // React Query mutation hook
  const createPost = useCreatePost();

  // Handle form submission
  const handleSubmit = () => {
    // Validation
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    // Execute mutation
    createPost.mutate(
      {
        title: title.trim(),
        content: content.trim(),
      },
      {
        onSuccess: (data) => {
          // Success callback
          Alert.alert('Success', `Post "${data.title}" created successfully!`);
          // Reset form
          setTitle('');
          setContent('');
        },
        onError: (error) => {
          // Error callback
          Alert.alert('Error', error.message || 'Failed to create post');
        },
      }
    );
  };

  // Handle cancel
  const handleCancel = () => {
    setTitle('');
    setContent('');
    createPost.reset(); // Reset mutation state
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create New Post</Text>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter post title"
              placeholderTextColor="#999999"
              editable={!createPost.isPending}
            />
          </View>

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder="Enter post content"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!createPost.isPending}
            />
          </View>

          {/* Error Message */}
          {createPost.isError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {createPost.error?.message || 'Failed to create post'}
              </Text>
            </View>
          )}

          {/* Success Message */}
          {createPost.isSuccess && !createPost.isPending && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>Post created successfully!</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={createPost.isPending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                createPost.isPending && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={createPost.isPending}
            >
              {createPost.isPending ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Creating...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Create Post</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Mutation State Info (Development) */}
          {__DEV__ && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Mutation State:</Text>
              <Text style={styles.debugText}>isPending: {String(createPost.isPending)}</Text>
              <Text style={styles.debugText}>isSuccess: {String(createPost.isSuccess)}</Text>
              <Text style={styles.debugText}>isError: {String(createPost.isError)}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#B0D4FF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  debugContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
});
