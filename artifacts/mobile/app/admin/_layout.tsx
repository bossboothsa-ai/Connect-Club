import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="send-notification"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
