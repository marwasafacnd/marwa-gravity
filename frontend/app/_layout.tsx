import React from 'react';
import { View, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a' },
          }}
        />
      </View>
    </CartProvider>
  );
}
