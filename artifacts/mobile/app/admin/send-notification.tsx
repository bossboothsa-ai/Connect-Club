import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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

const NOTIFICATION_TYPES = [
  { id: "event", label: "Event Alert", icon: "calendar" as const, color: Colors.primary },
  { id: "challenge", label: "Challenge Alert", icon: "award" as const, color: "#9A7AC9" },
  { id: "update", label: "General Update", icon: "bell" as const, color: "#5070B0" },
  { id: "location", label: "Live Location", icon: "map-pin" as const, color: "#5A8A5A" },
  { id: "winner", label: "Winner Announcement", icon: "award" as const, color: Colors.accent },
  { id: "partner", label: "Partner Promo", icon: "briefcase" as const, color: "#A0705A" },
];

export default function SendNotificationScreen() {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState("update");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Missing details", "Please fill in both title and message.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Notification sent!",
        "Your push notification has been delivered to all community members.",
        [{ text: "Done", onPress: () => router.back() }]
      );
    }, 1500);
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
        <Text style={styles.headerTitle}>Send Notification</Text>
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
        <View style={styles.infoBanner}>
          <Feather name="users" size={15} color={Colors.primary} />
          <Text style={styles.infoText}>
            This notification will be sent to all 248 community members
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notification Type</Text>
          <View style={styles.typeGrid}>
            {NOTIFICATION_TYPES.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.typeChip,
                  selectedType === type.id && styles.typeChipActive,
                  selectedType === type.id && { borderColor: type.color },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View
                  style={[
                    styles.typeChipIcon,
                    { backgroundColor: type.color + (selectedType === type.id ? "30" : "15") },
                  ]}
                >
                  <Feather name={type.icon} size={14} color={type.color} />
                </View>
                <Text
                  style={[
                    styles.typeChipLabel,
                    selectedType === type.id && styles.typeChipLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notification Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Something exciting is happening..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Tell your community what's happening..."
            placeholderTextColor={Colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {title && body && (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={styles.previewApp}>
                  <View style={styles.previewIcon} />
                  <Text style={styles.previewAppName}>Connect Club</Text>
                </View>
                <Text style={styles.previewTime}>now</Text>
              </View>
              <Text style={styles.previewTitle}>{title}</Text>
              <Text style={styles.previewBody} numberOfLines={2}>{body}</Text>
            </View>
          </View>
        )}

        <Button
          title="Send to All Members"
          onPress={handleSend}
          loading={loading}
          fullWidth
          style={styles.sendBtn}
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
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
  },
  content: {
    padding: 20,
    gap: 4,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: Colors.surface,
  },
  typeChipIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  typeChipLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  typeChipLabelActive: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
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
  preview: {
    gap: 8,
    marginBottom: 8,
  },
  previewLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  previewApp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  previewAppName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  previewTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  previewTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  previewBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sendBtn: {
    marginTop: 8,
  },
});
