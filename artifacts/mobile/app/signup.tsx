import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

type Field = {
  key: string;
  label: string;
  placeholder: string;
  icon: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "words";
  secure?: boolean;
  optional?: boolean;
};

const FIELDS: Field[] = [
  { key: "fullName", label: "Full Name", placeholder: "Your full name", icon: "user", autoCapitalize: "words" },
  { key: "username", label: "Username", placeholder: "@username", icon: "at-sign", autoCapitalize: "none" },
  { key: "email", label: "Email", placeholder: "your@email.com", icon: "mail", keyboardType: "email-address", autoCapitalize: "none" },
  { key: "phone", label: "Phone Number", placeholder: "+44 7700 900000", icon: "phone", keyboardType: "phone-pad" },
  { key: "city", label: "City", placeholder: "London", icon: "map-pin", autoCapitalize: "words" },
  { key: "instagramHandle", label: "Instagram Handle", placeholder: "@yourhandle", icon: "instagram", autoCapitalize: "none", optional: true },
  { key: "password", label: "Password", placeholder: "Create a strong password", icon: "lock", secure: true },
];

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const [form, setForm] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Create account", fields: ["fullName", "username"], subtitle: "Let's get started" },
    { title: "Contact details", fields: ["email", "phone", "city"], subtitle: "How can we reach you?" },
    { title: "Almost there", fields: ["instagramHandle", "password"], subtitle: "One last step" },
  ];

  const currentStep = steps[step];
  const currentFields = FIELDS.filter((f) => currentStep.fields.includes(f.key));

  const handleNext = () => {
    const required = currentFields.filter((f) => !f.optional);
    const missing = required.find((f) => !form[f.key]?.trim());
    if (missing) {
      Alert.alert("Missing details", `Please fill in your ${missing.label.toLowerCase()}.`);
      return;
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup({
        fullName: form.fullName?.trim() || "",
        username: form.username?.trim() || "",
        email: form.email?.trim().toLowerCase() || "",
        phone: form.phone?.trim() || "",
        city: form.city?.trim() || "",
        instagramHandle: form.instagramHandle?.trim(),
        password: form.password || "",
        role: "member",
        notificationsEnabled: true,
      });
      router.replace("/onboarding");
    } catch (e: any) {
      Alert.alert("Signup failed", e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FAF6F1", "#F0E8DC", "#FAF6F1"]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
              paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 40),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={20} color={Colors.text} />
            </Pressable>

            <View style={styles.stepIndicator}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.stepDot,
                    i === step && styles.stepDotActive,
                    i < step && styles.stepDotDone,
                  ]}
                />
              ))}
            </View>

            <View style={{ width: 44 }} />
          </View>

          <View style={styles.header}>
            <Text style={styles.stepLabel}>Step {step + 1} of {steps.length}</Text>
            <Text style={styles.title}>{currentStep.title}</Text>
            <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
          </View>

          <View style={styles.form}>
            {currentFields.map((field) => (
              <View key={field.key} style={styles.field}>
                <Text style={styles.label}>
                  {field.label}
                  {field.optional && (
                    <Text style={styles.optional}> (optional)</Text>
                  )}
                </Text>
                <View style={styles.inputContainer}>
                  <Feather
                    name={field.icon as any}
                    size={16}
                    color={Colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textMuted}
                    value={form[field.key] || ""}
                    onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                    keyboardType={field.keyboardType || "default"}
                    autoCapitalize={field.autoCapitalize || "none"}
                    secureTextEntry={field.secure && !showPassword}
                    autoCorrect={false}
                  />
                  {field.secure && (
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={16}
                        color={Colors.textMuted}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            ))}

            <Button
              title={step < steps.length - 1 ? "Continue" : "Join Connect Club"}
              onPress={handleNext}
              loading={loading}
              fullWidth
              style={styles.nextBtn}
            />

            <Pressable onPress={() => router.back()} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>
                Already a member?{" "}
                <Text style={styles.loginLinkBold}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  stepDotDone: {
    backgroundColor: Colors.primaryLight,
  },
  header: {
    marginBottom: 28,
  },
  stepLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textMuted,
  },
  form: {
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  eyeBtn: {
    padding: 4,
  },
  nextBtn: {
    marginTop: 8,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 16,
  },
  loginLinkText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  loginLinkBold: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
});
