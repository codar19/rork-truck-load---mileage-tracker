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
import { LoadTemplateProvider } from "@/contexts/LoadTemplateContext";
import { ExecutedPromptsProvider } from "@/contexts/ExecutedPromptsContext";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { trpc, trpcClient } from "@/lib/trpc";

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
      <Stack.Screen name="templates" options={{ headerShown: false }} />
      <Stack.Screen name="bulk-operations" options={{ headerShown: false }} />
      <Stack.Screen name="executed-prompts" options={{ headerShown: false }} />
      <Stack.Screen name="expenses" options={{ headerShown: false }} />
      <Stack.Screen name="add-expense" options={{ title: "Add Expense", presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <AuthProvider>
            <ExecutedPromptsProvider>
              <LoadProvider>
                <LoadTemplateProvider>
                  <OfferProvider>
                    <ExpenseProvider>
                    <GestureHandlerRootView>
                      <RootLayoutNav />
                    </GestureHandlerRootView>
                    </ExpenseProvider>
                  </OfferProvider>
                </LoadTemplateProvider>
              </LoadProvider>
            </ExecutedPromptsProvider>
          </AuthProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
