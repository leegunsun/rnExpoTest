import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'Drawer Navigation이란 무엇인가요?',
      answer:
        'Drawer Navigation은 화면 왼쪽에서 슬라이드하여 나타나는 메뉴입니다. Flutter의 Drawer 위젯과 동일한 기능을 제공합니다.',
    },
    {
      question: 'Drawer를 어떻게 열 수 있나요?',
      answer:
        '1) 좌측 상단의 메뉴 아이콘을 탭하거나, 2) 화면 왼쪽 가장자리에서 오른쪽으로 스와이프하세요.',
    },
    {
      question: 'Expo Router와 React Navigation의 차이는?',
      answer:
        'Expo Router는 파일 기반 라우팅을 제공하며, React Navigation을 내부적으로 사용합니다. Flutter의 Named Routes와 유사한 방식입니다.',
    },
    {
      question: '커스텀 Drawer Content를 만들 수 있나요?',
      answer:
        '네! drawerContent prop을 사용하여 완전히 커스텀된 Drawer를 만들 수 있습니다. _layout.tsx 파일을 참고하세요.',
    },
    {
      question: 'Flutter의 Drawer와 주요 차이점은?',
      answer:
        'React Native의 Drawer는 제스처 기반이며, Expo Router를 통해 파일 기반 라우팅을 사용합니다. Flutter의 선언적 방식과 유사하지만, 파일 구조로 라우팅을 정의합니다.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      label: '이메일',
      value: 'support@example.com',
      action: () => Linking.openURL('mailto:support@example.com'),
    },
    {
      icon: 'call',
      label: '전화',
      value: '+82 10-1234-5678',
      action: () => Linking.openURL('tel:+821012345678'),
    },
    {
      icon: 'chatbubbles',
      label: '라이브 채팅',
      value: '평일 9:00 - 18:00',
      action: () => console.log('Open chat'),
    },
  ];

  const quickLinks = [
    { icon: 'book', label: 'Expo Router 문서', url: 'https://docs.expo.dev/router/introduction/' },
    {
      icon: 'logo-react',
      label: 'React Navigation 문서',
      url: 'https://reactnavigation.org/docs/getting-started',
    },
    { icon: 'logo-github', label: 'GitHub', url: 'https://github.com/expo/expo' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
    >
      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
          자주 묻는 질문
        </Text>
        {faqItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.faqItem,
              { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
              expandedIndex === index && styles.faqItemExpanded,
            ]}
            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQuestion, { color: isDark ? '#fff' : '#333' }]}>
                {item.question}
              </Text>
              <Ionicons
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={isDark ? '#bbb' : '#666'}
              />
            </View>
            {expandedIndex === index && (
              <Text style={[styles.faqAnswer, { color: isDark ? '#bbb' : '#666' }]}>
                {item.answer}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
          문의하기
        </Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.contactItem,
                index !== contactOptions.length - 1 && styles.contactItemBorder,
                { borderBottomColor: isDark ? '#333' : '#eee' },
              ]}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.contactLeft}>
                <View style={[styles.contactIcon, { backgroundColor: '#2196F3' + '20' }]}>
                  <Ionicons name={option.icon as any} size={20} color="#2196F3" />
                </View>
                <View>
                  <Text style={[styles.contactLabel, { color: isDark ? '#fff' : '#333' }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.contactValue, { color: isDark ? '#bbb' : '#666' }]}>
                    {option.value}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#bbb' : '#666'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
          유용한 링크
        </Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          {quickLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.linkItem,
                index !== quickLinks.length - 1 && styles.linkItemBorder,
                { borderBottomColor: isDark ? '#333' : '#eee' },
              ]}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.7}
            >
              <View style={styles.linkLeft}>
                <Ionicons name={link.icon as any} size={20} color="#2196F3" />
                <Text style={[styles.linkLabel, { color: isDark ? '#fff' : '#333' }]}>
                  {link.label}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={isDark ? '#bbb' : '#666'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: isDark ? '#888' : '#999' }]}>
          App Version 1.0.0
        </Text>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  faqItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItemExpanded: {
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  contactItemBorder: {
    borderBottomWidth: 1,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  linkItemBorder: {
    borderBottomWidth: 1,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
  },
});
