import { Stack } from 'expo-router';

export default function ProjectLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Détails du projet',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#111827',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          presentation: 'modal',
          title: 'Modifier le projet',
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