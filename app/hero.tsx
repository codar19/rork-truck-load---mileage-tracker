import { useRouter } from 'expo-router';
import {
  Truck,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Clock,
  BarChart3,
  MapPin,
} from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 5 loads per month',
      'Basic load tracking',
      'Odometer readings',
      'Basic expense tracking',
      'Mobile app access',
    ],
    color: '#64748b',
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$29',
    period: 'per month',
    description: 'Full access with flexibility',
    features: [
      'Unlimited loads',
      'Advanced analytics',
      'Fuel consumption tracking',
      'Expense management',
      'Load profitability reports',
      'Real vs. claimed miles',
      'Priority support',
      'Export reports',
    ],
    color: '#f59e0b',
    popular: true,
  },
  {
    id: 'semi-annual',
    name: 'Pro 6-Month',
    price: '$149',
    period: 'every 6 months',
    description: 'Save 14% with commitment',
    savings: 'Save $25',
    features: [
      'Everything in Pro Monthly',
      '14% savings',
      'Priority onboarding',
      'Dedicated account manager',
      'Custom reports',
      'API access',
    ],
    color: '#3b82f6',
    popular: false,
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: '$279',
    period: 'per year',
    description: 'Best value for serious haulers',
    savings: 'Save $69',
    features: [
      'Everything in Pro Monthly',
      '20% savings',
      'VIP support',
      'Advanced integrations',
      'Custom branding',
      'Multi-user accounts',
      'White-label options',
      'Early access to features',
    ],
    color: '#8b5cf6',
    popular: false,
  },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track every mile, every dollar, every load with precision analytics',
    color: '#3b82f6',
  },
  {
    icon: DollarSign,
    title: 'Profit Tracking',
    description: 'Know your true earnings after fuel, expenses, and surcharges',
    color: '#22c55e',
  },
  {
    icon: MapPin,
    title: 'Mileage Verification',
    description: 'Compare dispatcher claims vs. actual miles driven',
    color: '#f59e0b',
  },
  {
    icon: TrendingUp,
    title: 'Expense Management',
    description: 'Track fuel, per diem, maintenance, and all operational costs',
    color: '#8b5cf6',
  },
  {
    icon: Clock,
    title: 'Load Timeline',
    description: 'Document every stage from dispatch to delivery completion',
    color: '#06b6d4',
  },
  {
    icon: Shield,
    title: 'Data Security',
    description: 'Your load data is encrypted and securely stored',
    color: '#ef4444',
  },
];

export default function HeroScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.heroBackground}>
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#0f172a']}
          style={styles.gradient}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Truck size={32} color="#f59e0b" strokeWidth={2.5} />
            <Text style={styles.logoText}>LoadBoard Pro</Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Zap size={16} color="#f59e0b" />
            <Text style={styles.badgeText}>Trusted by 10,000+ Truckers</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Stop Guessing.{'\n'}
            Start <Text style={styles.heroTitleAccent}>Earning More</Text>.
          </Text>
          
          <Text style={styles.heroSubtitle}>
            The only load tracking system that shows your real profit per mile. 
            Track loads, verify mileage, calculate expenses, and know exactly what you&apos;re making.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
              <Text style={styles.primaryButtonText}>Get Started Free</Text>
              <CheckCircle size={20} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.freeText}>No credit card required</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$2.4M+</Text>
              <Text style={styles.statLabel}>Revenue Tracked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>450K+</Text>
              <Text style={styles.statLabel}>Loads Managed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Built for Professional Truckers</Text>
          <Text style={styles.sectionSubtitle}>
            Every feature designed to maximize your earnings and minimize headaches
          </Text>

          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const bgColor = feature.color + '20';
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: bgColor }]}>
                    <Icon size={24} color={feature.color} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Simple, Transparent Pricing</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the plan that fits your hauling business
          </Text>

          <View style={styles.plansContainer}>
            {PLANS.map((plan) => (
              <View 
                key={plan.id} 
                style={[
                  styles.planCard,
                  plan.popular && styles.planCardPopular,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPricing}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <CheckCircle size={18} color="#22c55e" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[
                    styles.planButton,
                    plan.popular && styles.planButtonPopular,
                  ]}
                  onPress={handleGetStarted}
                >
                  <Text style={[
                    styles.planButtonText,
                    plan.popular && styles.planButtonTextPopular,
                  ]}>
                    {plan.id === 'free' ? 'Start Free' : 'Get Started'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Users size={48} color="#f59e0b" />
            <Text style={styles.ctaTitle}>Ready to Take Control?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of drivers who&apos;ve increased their profit margins by an average of 23%
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
              <Text style={styles.ctaButtonText}>Start Your Free Trial</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 LoadBoard Pro. All rights reserved.</Text>
          <Text style={styles.footerSubtext}>
            Professional load management for independent truckers
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 600,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  loginButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#f59e0b',
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '900' as const,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 48,
  },
  heroTitleAccent: {
    color: '#f59e0b',
  },
  heroSubtitle: {
    fontSize: 17,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  heroButtons: {
    alignItems: 'center',
    marginBottom: 48,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  freeText: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#f59e0b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  pricingSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#0a0f1a',
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#334155',
  },
  planCardPopular: {
    borderColor: '#f59e0b',
    backgroundColor: '#1a1f2e',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f59e0b',
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  planHeader: {
    marginBottom: 24,
    paddingTop: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 40,
    fontWeight: '900' as const,
    color: '#ffffff',
  },
  planPeriod: {
    fontSize: 14,
    color: '#64748b',
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  planDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  planFeatures: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  planButtonPopular: {
    backgroundColor: '#f59e0b',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  planButtonTextPopular: {
    color: '#ffffff',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  ctaCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#475569',
  },
});
