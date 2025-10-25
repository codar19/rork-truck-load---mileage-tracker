import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Plus, 
  Filter,
  Calendar,
  DollarSign,
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
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react-native';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';

const getCategoryIcon = (category: ExpenseCategory, size: number = 20, color: string = '#f59e0b') => {
  const iconMap: Record<ExpenseCategory, any> = {
    fuel: Fuel,
    tolls: Coins,
    maintenance: Wrench,
    food: UtensilsCrossed,
    lodging: Hotel,
    parking: ParkingCircle,
    scales: Scale,
    truck_wash: Droplets,
    supplies: Package,
    other: MoreHorizontal,
  };
  
  const Icon = iconMap[category];
  return <Icon size={size} color={color} />;
};

export default function ExpensesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getExpensesByDriver, calculateSummary } = useExpenses();
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | ExpenseCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const userExpenses = user ? getExpensesByDriver(user.id) : [];
  
  const filteredExpenses = userExpenses.filter(expense => {
    const categoryMatch = selectedFilter === 'all' || expense.category === selectedFilter;
    const statusMatch = selectedStatus === 'all' || expense.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const summary = calculateSummary(filteredExpenses);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'rejected':
        return <XCircle size={16} color="#ef4444" />;
      case 'pending':
        return <Clock size={16} color="#f59e0b" />;
      default:
        return null;
    }
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
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-expense')}
        >
          <Plus size={24} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Total Expenses</Text>
            <Calendar size={20} color="#94a3b8" />
          </View>
          <Text style={styles.summaryAmount}>{formatCurrency(summary.totalExpenses)}</Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <Clock size={16} color="#f59e0b" />
              </View>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statValue}>{formatCurrency(summary.pending)}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <CheckCircle size={16} color="#10b981" />
              </View>
              <Text style={styles.statLabel}>Approved</Text>
              <Text style={styles.statValue}>{formatCurrency(summary.approved)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Filter size={18} color="#f59e0b" />
            <Text style={styles.filterTitle}>Filter by Category</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextActive,
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            {EXPENSE_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.filterChip,
                  selectedFilter === cat.value && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(cat.value)}
              >
                {getCategoryIcon(cat.value, 16, selectedFilter === cat.value ? '#ffffff' : '#64748b')}
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === cat.value && styles.filterChipTextActive,
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.statusFilterSection}>
          <View style={styles.statusFilters}>
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusFilterChip,
                  selectedStatus === status && styles.statusFilterChipActive,
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[
                  styles.statusFilterText,
                  selectedStatus === status && styles.statusFilterTextActive,
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.expensesList}>
          {filteredExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <DollarSign size={48} color="#334155" />
              <Text style={styles.emptyStateText}>No expenses found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedFilter !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first expense to get started'}
              </Text>
            </View>
          ) : (
            filteredExpenses.map(expense => (
              <View
                key={expense.id}
                style={styles.expenseCard}
              >
                <View style={styles.expenseCardLeft}>
                  <View style={[styles.categoryIconWrapper, { backgroundColor: '#1e293b' }]}>
                    {getCategoryIcon(expense.category, 24, '#f59e0b')}
                  </View>
                  <View style={styles.expenseCardInfo}>
                    <Text style={styles.expenseCategory}>
                      {EXPENSE_CATEGORIES.find(c => c.value === expense.category)?.label}
                    </Text>
                    <View style={styles.expenseCardMeta}>
                      <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                      {expense.location && (
                        <>
                          <Text style={styles.expenseDot}>•</Text>
                          <Text style={styles.expenseLocation} numberOfLines={1}>
                            {expense.location}
                          </Text>
                        </>
                      )}
                    </View>
                    {expense.description && (
                      <Text style={styles.expenseDescription} numberOfLines={1}>
                        {expense.description}
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.expenseCardRight}>
                  <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(expense.status)}20` }]}>
                    {getStatusIcon(expense.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(expense.status) }]}>
                      {expense.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/add-expense')}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500' as const,
  },
  statValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '700' as const,
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#334155',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  filterScroll: {
    paddingLeft: 20,
  },
  filterScrollContent: {
    paddingRight: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  statusFilterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  statusFilterChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  statusFilterChipActive: {
    backgroundColor: '#334155',
    borderColor: '#f59e0b',
  },
  statusFilterText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#64748b',
  },
  statusFilterTextActive: {
    color: '#f59e0b',
  },
  expensesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#cbd5e1',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  expenseCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseCardInfo: {
    flex: 1,
    gap: 4,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  expenseCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expenseDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  expenseDot: {
    fontSize: 13,
    color: '#64748b',
  },
  expenseLocation: {
    fontSize: 13,
    color: '#94a3b8',
    flex: 1,
  },
  expenseDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  expenseCardRight: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: 12,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  floatingButton: {
    position: 'absolute' as const,
    bottom: Platform.OS === 'web' ? 24 : 40,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
