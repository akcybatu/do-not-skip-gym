import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomePage } from './src/screens/HomePage';
import { useAuthStore } from './src/stores/authStore';

export default function App() {
  const { checkUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {!isAuthenticated ? (
        <LoginScreen />
      ) : (
        <HomePage />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
