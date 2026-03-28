// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadProvider } from "@/contexts/LoadContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { OfferProvider } from "@/contexts/OfferContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="hero" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="analytics" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="add-load" options={{ title: "Add New Load", presentation: "modal" }} />
      <Stack.Screen name="load/[id]" options={{ title: "Load Details" }} />
      <Stack.Screen name="suggestion/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="load-board" options={{ headerShown: false }} />
      <Stack.Screen name="my-offers" options={{ headerShown: false }} />
      <Stack.Screen name="available-load/[id]" options={{ title: "Load Details" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <LoadProvider>
            <OfferProvider>
              <GestureHandlerRootView>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </OfferProvider>
          </LoadProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
