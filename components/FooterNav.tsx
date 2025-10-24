import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import { Home, Settings, BarChart3 } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FooterButton {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  testID?: string;
}

export default function FooterNav() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const getButtons = (): FooterButton[] => {
    const buttons: FooterButton[] = [];

    buttons.push({
      icon: <Home size={24} color={pathname === '/dashboard' ? '#f59e0b' : '#64748b'} />,
      label: 'Home',
      onPress: () => router.push('/dashboard'),
      active: pathname === '/dashboard',
      testID: 'footer-home',
    });

    if (user.role === 'driver') {
      buttons.push({
        icon: <BarChart3 size={24} color={pathname === '/analytics' ? '#f59e0b' : '#64748b'} />,
        label: 'Analytics',
        onPress: () => router.push('/analytics'),
        active: pathname === '/analytics',
        testID: 'footer-analytics',
      });
    }

    if (user.role === 'admin') {
      buttons.push({
        icon: <BarChart3 size={24} color={pathname === '/analytics' ? '#f59e0b' : '#64748b'} />,
        label: 'Analytics',
        onPress: () => router.push('/analytics'),
        active: pathname === '/analytics',
        testID: 'footer-analytics',
      });
    }

    buttons.push({
      icon: <Settings size={24} color={pathname === '/settings' ? '#f59e0b' : '#64748b'} />,
      label: 'Settings',
      onPress: () => router.push('/settings'),
      active: pathname === '/settings',
      testID: 'footer-settings',
    });

    return buttons;
  };

  const buttons = getButtons();

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.footer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={button.onPress}
            testID={button.testID}
          >
            {button.icon}
            <Text style={[styles.label, button.active && styles.labelActive]}>
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  labelActive: {
    color: '#f59e0b',
  },
});
