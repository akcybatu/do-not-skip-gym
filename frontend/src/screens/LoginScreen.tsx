import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { LoginFormData } from '../types/auth';

export const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { 
    signIn, 
    signUp, 
    isLoading, 
    error, 
    clearError, 
    showEmailConfirmation, 
    pendingEmail, 
    clearEmailConfirmation,
    clearPasswordReset,
    sendPasswordReset,
    showPasswordReset,
    passwordResetSent
  } = useAuthStore();

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    clearError();
    await signIn(formData.email.trim(), formData.password);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    clearError();
    await signUp(formData.email.trim(), formData.password);
  };

  const updateForm = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const isExistingUserError = error && error.includes('account with this email address already exists');

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    clearError();
    await sendPasswordReset(formData.email.trim());
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    clearError();
    clearEmailConfirmation();
    clearPasswordReset();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* App Title */}
          <Text style={styles.title}>🏋️‍♂️ Do Not Skip Gym</Text>

          {/* Email Confirmation Message */}
          {showEmailConfirmation && (
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationTitle}>📧 Check Your Email!</Text>
              <Text style={styles.confirmationText}>
                You have received an email to confirm your email address at{' '}
                <Text style={styles.emailText}>{pendingEmail}</Text>.
              </Text>
              <Text style={styles.confirmationText}>
                Please confirm to be eligible to sign-in to your account.
              </Text>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={handleBackToLogin}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Password Reset Confirmation */}
          {showPasswordReset && (
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationTitle}>🔑 Password Reset Email Sent!</Text>
              
              {passwordResetSent && (
                <View style={styles.successBanner}>
                  <Text style={styles.successText}>✅ Password reset email sent successfully!</Text>
                </View>
              )}
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              
              <Text style={styles.confirmationText}>
                We've sent a password reset link to{' '}
                <Text style={styles.emailText}>{pendingEmail}</Text>.
              </Text>
              <Text style={styles.confirmationText}>
                Click the link in your email to reset your password in your browser, then return here to sign in with your new password.
              </Text>
              
              <View style={styles.passwordResetActions}>
                <TouchableOpacity
                  style={styles.resendResetButton}
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                >
                  <Text style={styles.resendResetButtonText}>
                    {isLoading ? '⏳ Sending...' : '🔄 Resend Reset Email'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.backToLoginButton}
                  onPress={handleBackToLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Form Container */}
          {!showEmailConfirmation && !showPasswordReset && (
            <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>📧 Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateForm('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>🔒 Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => updateForm('password', value)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Error Message */}
            {error && (
              <View style={[styles.errorContainer, isExistingUserError && styles.existingUserContainer]}>
                <Text style={[styles.errorText, isExistingUserError && styles.existingUserText]}>
                  {error}
                </Text>
                {isExistingUserError && (
                  <Text style={styles.suggestionText}>
                    💡 Try using the "Sign In" button above with your existing credentials.
                  </Text>
                )}
              </View>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, isLoading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    color: '#333',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 56,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#d63031',
    fontSize: 14,
    textAlign: 'center',
  },
  confirmationContainer: {
    backgroundColor: '#e8f5e8',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  backToLoginButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4caf50',
    borderRadius: 8,
  },
  backToLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  existingUserContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
  },
  existingUserText: {
    color: '#856404',
  },
  suggestionText: {
    color: '#856404',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  successText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  passwordResetActions: {
    marginTop: 16,
    gap: 12,
    width: '100%',
  },
  resendResetButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  resendResetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
