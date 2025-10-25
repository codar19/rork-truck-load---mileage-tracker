import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Fuel,
  Coins,
  Wrench,
  UtensilsCrossed,
  Hotel,
  ParkingCircle,
  Scale,
  Droplets,
  Package,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react-native';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';

export default function AddExpenseScreen() {
  const router = useRouter();

  const getCategoryIcon = (category: ExpenseCategory, size: number = 24, color: string = '#f59e0b') => {
    const iconName = EXPENSE_CATEGORIES.find(c => c.value === category)?.icon || 'MoreHorizontal';
    const icons: Record<string, any> = {
      Fuel,
      Coins,
      Wrench,
      UtensilsCrossed,
      Hotel,
      ParkingCircle,
      Scale,
      Droplets,
      Package,
      MoreHorizontal,
    };
    
    const Icon = icons[iconName];
    return <Icon size={size} color={color} />;
  };

  const handleCategorySelect = (category: ExpenseCategory) => {
    console.log('[AddExpense] Category selected:', category);
    router.push(`/expense-form?category=${category}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Expense Category</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Choose the type of expense you want to add</Text>
          
          <View style={styles.categoryList}>
            {EXPENSE_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.value}
                style={styles.categoryRow}
                onPress={() => handleCategorySelect(category.value)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryRowLeft}>
                  <View style={styles.categoryIconWrapper}>
                    {getCategoryIcon(category.value, 24, '#f59e0b')}
                  </View>
                  <Text style={styles.categoryLabel}>
                    {category.label}
                  </Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    padding: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  categoryList: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  categoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
});
