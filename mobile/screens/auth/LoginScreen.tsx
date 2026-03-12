import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthScreenProps } from '../../navigation/types';
import { colors } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const bgVideo = require('../../assets/auth-bg.mp4');
const logo = require('../../assets/logo-white.png');

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const player = useVideoPlayer(bgVideo, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  async function handleLogin() {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Login Failed', err?.message ?? 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Full-screen video background */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Dark overlay — matches Auth.tsx charcoal/70 on mobile */}
      <View style={styles.overlay} />

      {/* Logo pinned near the top */}
      <View style={styles.logoContainer}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Form layered over the video */}
      <KeyboardAvoidingView
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to your account</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              isLoading && styles.buttonDisabled,
              pressed && !isLoading && styles.buttonPressed,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.switchLink}>Create one</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(43,50,42,0.72)',
  },
  logoContainer: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 180,
    height: 52,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 52,
    paddingTop: 160,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subheading: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 32,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  buttonText: {
    color: colors.charcoal,
    fontWeight: '600',
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  switchLink: {
    color: colors.gold,
    fontWeight: '600',
    fontSize: 14,
  },
});
