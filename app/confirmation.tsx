import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Phone, MessageCircle, Home } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const COMPANY_PHONE = '+27123456789';
const WHATSAPP_NUMBER = '27123456789';

export default function ConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    Linking.openURL(`tel:${COMPANY_PHONE}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello, I just submitted a roadside assistance request.`);
  };

  const handleNewRequest = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.iconContainer}>
          <CheckCircle color={colors.success} size={80} strokeWidth={2} />
        </View>

        <Text style={styles.title}>Request Received!</Text>
        
        <Text style={styles.message}>
          Thank you for contacting Jozi Motors Crew. Our team has received your request and will contact you shortly.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • Our dispatch team is reviewing your request{'\n'}
            • A professional will contact you within 15 minutes{'\n'}
            • We&apos;ll provide an estimated arrival time{'\n'}
            • Help is on the way!
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need immediate assistance?</Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleCall}
          >
            <View style={styles.iconCircle}>
              <Phone color={colors.white} size={20} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>{COMPANY_PHONE}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactButton, styles.whatsappButton]}
            onPress={handleWhatsApp}
          >
            <View style={[styles.iconCircle, styles.whatsappIcon]}>
              <MessageCircle color={colors.white} size={20} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>Chat with us</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleNewRequest}
        >
          <Home color={colors.primary} size={20} />
          <Text style={styles.homeButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textLight,
    lineHeight: 20,
  },
  contactSection: {
    width: '100%',
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  whatsappIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    opacity: 0.8,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.white,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    width: '100%',
  },
  homeButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.primary,
    marginLeft: 8,
  },
});
