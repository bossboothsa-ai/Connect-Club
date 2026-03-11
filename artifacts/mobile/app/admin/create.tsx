import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/ui/Button";

const TYPE_CONFIG: Record<
  string,
  { title: string; icon: string; color: string; fields: Array<{ key: string; label: string; placeholder: string; multiline?: boolean; optional?: boolean }> }
> = {
  post: {
    title: "New Post",
    icon: "edit-2",
    color: Colors.primary,
    fields: [
      { key: "title", label: "Post Title", placeholder: "What's happening?" },
      { key: "content", label: "Content", placeholder: "Share your update with the community...", multiline: true },
      { key: "image", label: "Image URL", placeholder: "https://...", optional: true },
    ],
  },
  event: {
    title: "New Event",
    icon: "calendar",
    color: Colors.accent,
    fields: [
      { key: "title", label: "Event Name", placeholder: "Boogie & Brunch" },
      { key: "description", label: "Description", placeholder: "Tell people what to expect...", multiline: true },
      { key: "date", label: "Date", placeholder: "2026-04-01" },
      { key: "time", label: "Time", placeholder: "19:00" },
      { key: "location", label: "Location", placeholder: "Shoreditch, London or 'Secret Location'" },
      { key: "price", label: "Price", placeholder: "45 or 'free' or 'rsvp'" },
      { key: "spots", label: "Total Spots", placeholder: "50", optional: true },
      { key: "image", label: "Cover Image URL", placeholder: "https://...", optional: true },
    ],
  },
  challenge: {
    title: "New Challenge",
    icon: "award",
    color: "#9A7AC9",
    fields: [
      { key: "title", label: "Challenge Title", placeholder: "Win 2 tickets to..." },
      { key: "description", label: "Description", placeholder: "What's this challenge about?", multiline: true },
      { key: "prize", label: "Prize", placeholder: "2x Event Tickets (worth £80)" },
      { key: "instructions", label: "How to Enter", placeholder: "Step 1...\nStep 2...", multiline: true },
      { key: "startDate", label: "Start Date", placeholder: "2026-03-20" },
      { key: "endDate", label: "End Date", placeholder: "2026-03-25" },
    ],
  },
  survey: {
    title: "New Survey / Poll",
    icon: "clipboard",
    color: "#5070B0",
    fields: [
      { key: "title", label: "Survey Title", placeholder: "What event do you want next?" },
      { key: "description", label: "Description", placeholder: "Help us plan the next experience...", multiline: true },
      { key: "question1", label: "Question 1", placeholder: "e.g. What type of event do you prefer?" },
      { key: "options", label: "Options", placeholder: "Option A\nOption B\nOption C", multiline: true, optional: true },
    ],
  },
  location: {
    title: "Live Location Drop",
    icon: "map-pin",
    color: "#5A8A5A",
    fields: [
      { key: "title", label: "Drop Title", placeholder: "Find me here right now!" },
      { key: "location", label: "Location Name", placeholder: "Saunders Café, Columbia Road" },
      { key: "message", label: "Message", placeholder: "First 20 people get a surprise...", multiline: true },
      { key: "duration", label: "Duration (hours)", placeholder: "1" },
    ],
  },
  partner: {
    title: "Partner Spotlight",
    icon: "briefcase",
    color: "#A0705A",
    fields: [
      { key: "partnerName", label: "Partner / Brand Name", placeholder: "Alchemy Wellness" },
      { key: "title", label: "Spotlight Title", placeholder: "Exclusive offer for Connect Club members" },
      { key: "description", label: "Description", placeholder: "Tell the community about this partner...", multiline: true },
      { key: "offer", label: "Special Offer", placeholder: "20% off with code CONNECT", optional: true },
      { key: "image", label: "Image URL", placeholder: "https://...", optional: true },
    ],
  },
};

export default function CreateContentScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const config = TYPE_CONFIG[type || "post"] || TYPE_CONFIG.post;

  const handleSubmit = async () => {
    const required = config.fields.filter((f) => !f.optional);
    const missing = required.find((f) => !form[f.key]?.trim());
    if (missing) {
      Alert.alert("Missing details", `Please fill in: ${missing.label}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Published!",
        `Your ${config.title.toLowerCase()} has been published to the community.`,
        [{ text: "Done", onPress: () => router.back() }]
      );
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={20} color={Colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.headerIcon, { backgroundColor: config.color + "20" }]}>
            <Feather name={config.icon as any} size={18} color={config.color} />
          </View>
          <Text style={styles.headerTitle}>{config.title}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 40),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {config.fields.map((field) => (
          <View key={field.key} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.optional && (
                <Text style={styles.optional}> (optional)</Text>
              )}
            </Text>
            <TextInput
              style={[styles.input, field.multiline && styles.multilineInput]}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textMuted}
              value={form[field.key] || ""}
              onChangeText={(v) => setForm({ ...form, [field.key]: v })}
              multiline={field.multiline}
              numberOfLines={field.multiline ? 4 : 1}
              textAlignVertical={field.multiline ? "top" : "center"}
            />
          </View>
        ))}

        <Button
          title={`Publish ${config.title}`}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          style={styles.submitBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
  },
  content: {
    padding: 20,
    gap: 4,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  optional: {
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  multilineInput: {
    minHeight: 110,
    paddingTop: 14,
  },
  submitBtn: {
    marginTop: 8,
  },
});
