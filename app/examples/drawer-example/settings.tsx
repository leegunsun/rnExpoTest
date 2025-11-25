import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(isDark);
  const [biometric, setBiometric] = useState(false);

  const settingsSections = [
    {
      title: '알림',
      items: [
        {
          icon: 'notifications',
          label: '푸시 알림',
          value: pushEnabled,
          onToggle: setPushEnabled,
          type: 'switch' as const,
        },
        {
          icon: 'mail',
          label: '이메일 알림',
          value: emailEnabled,
          onToggle: setEmailEnabled,
          type: 'switch' as const,
        },
      ],
    },
    {
      title: '앱 설정',
      items: [
        {
          icon: 'moon',
          label: '다크 모드',
          value: darkMode,
          onToggle: setDarkMode,
          type: 'switch' as const,
        },
        {
          icon: 'language',
          label: '언어',
          value: '한국어',
          type: 'select' as const,
        },
      ],
    },
    {
      title: '보안',
      items: [
        {
          icon: 'finger-print',
          label: '생체 인증',
          value: biometric,
          onToggle: setBiometric,
          type: 'switch' as const,
        },
        {
          icon: 'key',
          label: '비밀번호 변경',
          type: 'navigate' as const,
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
    >
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
            {section.title}
          </Text>
          <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            {section.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex !== section.items.length - 1 && styles.settingItemBorder,
                  { borderBottomColor: isDark ? '#333' : '#eee' },
                ]}
              >
                <View style={styles.settingLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={isDark ? '#2196F3' : '#2196F3'}
                  />
                  <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#333' }]}>
                    {item.label}
                  </Text>
                </View>

                {item.type === 'switch' && (
                  <Switch
                    value={item.value as boolean}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={item.value ? '#2196F3' : '#f4f3f4'}
                  />
                )}

                {item.type === 'select' && (
                  <View style={styles.selectContainer}>
                    <Text style={[styles.selectValue, { color: isDark ? '#bbb' : '#666' }]}>
                      {item.value}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? '#bbb' : '#666'}
                    />
                  </View>
                )}

                {item.type === 'navigate' && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#bbb' : '#666'}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>정보</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle" size={22} color="#2196F3" />
              <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#333' }]}>
                앱 정보
              </Text>
            </View>
            <Text style={[styles.version, { color: isDark ? '#bbb' : '#666' }]}>v1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              styles.settingItemBorder,
              { borderBottomColor: isDark ? '#333' : '#eee' },
            ]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="document-text" size={22} color="#2196F3" />
              <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#333' }]}>
                이용 약관
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#bbb' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark" size={22} color="#2196F3" />
              <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#333' }]}>
                개인정보 처리방침
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#bbb' : '#666'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValue: {
    fontSize: 14,
    marginRight: 4,
  },
  version: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});
