import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Truck, Phone, Clock, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.heroBackground} />
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Truck color={colors.white} size={48} strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.title}>RoadMate</Text>
            <Text style={styles.subtitle}>Fast Towing & Roadside Help</Text>
            <Text style={styles.company}>by Jozi Motors Crew</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.featureCard}>
                <Clock color={colors.primary} size={28} />
                <Text style={styles.featureTitle}>24/7</Text>
                <Text style={styles.featureText}>Available</Text>
              </View>
              <View style={styles.featureCard}>
                <Shield color={colors.primary} size={28} />
                <Text style={styles.featureTitle}>Licensed</Text>
                <Text style={styles.featureText}>& Insured</Text>
              </View>
            </View>
            <View style={styles.featureCard}>
              <Phone color={colors.primary} size={28} />
              <Text style={styles.featureTitle}>Quick Response</Text>
              <Text style={styles.featureText}>Professional team on standby</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => router.push('/request' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Request Assistance</Text>
            <View style={styles.buttonIcon}>
              <Truck color={colors.white} size={24} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Towing • Jumpstarts • Tire Changes • Lockouts
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.secondary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Poppins_700Bold',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    opacity: 0.7,
  },
  featuresContainer: {
    marginTop: 32,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginTop: 12,
  },
  featureText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  mainButtonText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.white,
    marginRight: 12,
  },
  buttonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textLight,
    textAlign: 'center',
  },
});
