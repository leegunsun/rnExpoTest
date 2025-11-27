/**
 * ChartShareButton - Capture and share chart as image
 */

import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

import { Colors } from '@/constants/theme';

interface ChartShareButtonProps {
  chartRef: React.RefObject<View | null>;
  disabled?: boolean;
}

export function ChartShareButton({ chartRef, disabled }: ChartShareButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!chartRef.current) {
      Alert.alert('오류', '차트를 찾을 수 없습니다.');
      return;
    }

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('알림', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
      return;
    }

    setIsCapturing(true);

    try {
      // Capture the chart as an image
      const uri = await captureRef(chartRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      // Share the captured image directly
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '캐릭터 매력 차트 공유',
        UTI: 'public.png',
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('오류', '이미지 공유 중 오류가 발생했습니다.');
    } finally {
      setIsCapturing(false);
    }
  }, [chartRef]);

  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handleShare}
      disabled={disabled || isCapturing}
    >
      {isCapturing ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          <Text style={styles.buttonIcon}>📤</Text>
          <Text style={styles.buttonText}>공유하기</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
