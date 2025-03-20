import { Stack } from 'expo-router';

export default function ProjectLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          presentation: 'modal',
          title: 'Nouveau projet',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#111827',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}