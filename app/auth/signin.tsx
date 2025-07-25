import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AuthWrapper from '@/components/auth/authWrapper';
import AppleIcon from '@/assets/icons/apple.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import { useDarkMode } from '@/context/DarkModeContext';
import { signInWithApple, signInWithEmail, signInWithGoogle } from '@/api/auth/login';
import { router, useLocalSearchParams } from 'expo-router';
import EyeIcon from '@/assets/icons/eye.svg';
import EyeOffIcon from '@/assets/icons/eye-slash.svg';

export default function SignIn() {
  const params = useLocalSearchParams();
  const shouldShowVerifyBadge = params?.verify === "1";
  const shouldShowSuccessBadge = params?.success === "1";
  const { isDarkMode } = useDarkMode();
  const textColor = isDarkMode ? '#F9FAFB' : '#111827';
  const mutedText = isDarkMode ? '#9CA3AF' : 'rgba(0, 0, 0, 0.2)';
  const backgroundColor = isDarkMode ? 'rgba(42, 42, 42, 1)' : '#FFFFFF';
  const inputBackground = isDarkMode ? 'rgba(0, 0, 0, 0.1)' : '#fff';
  const inputTextColor = isDarkMode ? '#fff' : '#000';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [wasAttempted, setWasAttempted] = useState(false);
  const [cachedError, setCachedError] = useState('');
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Listen for screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  // Get current screen width and determine if it's small
  const { width } = screenData;
  const isSmallScreen = width < 600;

  const generateErrorMessage = () => {
    let message = '';
    if (!email.trim()) message += 'Email is required. ';
    if (password.length < 8) message += 'Password must be at least 8 characters. ';
    return message.trim();
  };

  const formIsValid =
    email.trim() !== '' &&
    password.length >= 8;

  const containerPadding = isSmallScreen ? 24 : 80;

  return (
    <AuthWrapper>
      <View style={[styles.container, { backgroundColor, padding: containerPadding }]}>
          {shouldShowVerifyBadge && (
          <View style={{
            backgroundColor: "#F59E0B",
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <Text style={{ color: "#1F2937", fontWeight: "500", textAlign: "center" }}>
              Please verify your email before continuing.
            </Text>
          </View>
        )}
        {shouldShowSuccessBadge && (
            <View style={{
              backgroundColor: "#10B981",
              padding: 10,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Text style={{ color: "#F0FDF4", fontWeight: "500", textAlign: "center" }}>
                Reset email sent. Please check your inbox.
              </Text>
            </View>
          )}
        <Text style={[styles.title, { color: textColor }]}>Sign In</Text>
        <Text style={[styles.subtitle, { color: mutedText }]}>Your Social Campaigns</Text>
        
        <View style={[styles.buttonRow, { flexDirection: isSmallScreen ? 'column' : 'row' }]}>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: inputBackground }]} onPress={signInWithApple}>
            <AppleIcon width={16} height={16} style={styles.icon} fill={isDarkMode ? '#FFFFFF' : '#111827'}/>
            {!isSmallScreen && <Text style={[styles.socialText, { color: isDarkMode ? '#fff' : '#111827' }]}>Sign in with Apple</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: inputBackground }]} onPress={signInWithGoogle}>
            <GoogleIcon width={16} height={16} style={styles.icon} />
            {!isSmallScreen && <Text style={[styles.socialText, { color: isDarkMode ? '#fff' : '#111827' }]}>Sign in with Google</Text>}
          </TouchableOpacity>
        </View>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={[styles.orText, { color: mutedText }]}>Or with Email</Text>
        <View style={styles.line} />
      </View>
        
        <TextInput 
          placeholder="Email" 
          onChangeText={setEmail}
          placeholderTextColor={mutedText} 
          style={[styles.input, { backgroundColor: inputBackground, color: inputTextColor }]} 
        />
        <View>
        <TextInput 
          placeholder="Password" 
          onChangeText={setPassword}
          placeholderTextColor={mutedText} 
          secureTextEntry={!showPassword} 
          style={[styles.input, { backgroundColor: inputBackground, color: inputTextColor }]} 
        />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon width={20} height={20} fill={mutedText} />
            ) : (
              <EyeIcon width={20} height={20} fill={mutedText} />
            )}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.forgotWrapper} onPress={() => router.push('/auth/forgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {wasAttempted && cachedError !== '' && (
          <Text style={{ color: 'red', fontSize: 12, marginBottom: 12 }}>
            {cachedError}
          </Text>
        )}
        
        <TouchableOpacity
          style={[styles.signInButton, { opacity: formIsValid ? 1 : 0.5 }]}
          onPress={async () => {
            if (!formIsValid) {
              const errorMsg = generateErrorMessage();
              setCachedError(errorMsg);
              setWasAttempted(true);
            } else {
              try {
                const { data, error } = await signInWithEmail(email, password); // <-- call Supabase
                if (error) {
                  setCachedError(error.message);
                  setWasAttempted(true);
                } else {
                  router.push("/");
                }
              } catch (err) {
                setCachedError("Unexpected error. Please try again.");
                setWasAttempted(true);
              }
            }
          }}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
        
        <Text style={[styles.bottomText, { color: mutedText }]}>
          Not a Member yet? <TouchableOpacity onPress={() => router.push('/auth/signup')}><Text style={styles.link}>Sign Up</Text></TouchableOpacity>
        </Text>
      </View>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 550,
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    borderWidth: .5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
  },
  socialText: {
    fontSize: 14,
  },
  icon: {
    height: 16,
    width: 16,
  },
  orText: {
    textAlign: 'center',
    fontSize: 13,
  },
  input: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: .5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  forgotWrapper: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#3B82F6',
    fontSize: 13,
  },
  signInButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    alignContent: 'center',
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 13,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    alignContent: 'center',
    justifyContent: 'center',
    top: '18%',
  },
  link: {
    color: '#3B82F6',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
});