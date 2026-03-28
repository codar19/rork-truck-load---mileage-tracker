import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="screens" />
      <Stack.Screen name="stripe" />
      <Stack.Screen name="business" />
      <Stack.Screen name="users" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="security" />
      <Stack.Screen name="database" />
    </Stack>
  );
}
