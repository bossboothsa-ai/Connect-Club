import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Please check your details and try again.");
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
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>C</Text>
            </View>
            <Text style={styles.brandName}>Connect Club</Text>
            <Text style={styles.brandTagline}>Jenna's Private Community</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.form}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSub}>Sign in to your account</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={16} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={16} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={16}
                    color={Colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.signInBtn}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.signupBtn}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.signupBtnText}>
                Don't have an account?{" "}
                <Text style={styles.signupBtnBold}>Join Connect Club</Text>
              </Text>
            </Pressable>

            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Demo accounts</Text>
              <Pressable onPress={() => { setEmail("jenna@connectclub.com"); setPassword("admin123"); }}>
                <Text style={styles.demoText}>Admin: jenna@connectclub.com / admin123</Text>
              </Pressable>
              <Pressable onPress={() => { setEmail("sofia@example.com"); setPassword("password123"); }}>
                <Text style={styles.demoText}>Member: sofia@example.com / password123</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoIcon: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: "#fff",
  },
  brandName: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  welcomeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  welcomeSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundAlt,
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
  signInBtn: {
    marginTop: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  signupBtn: {
    alignItems: "center",
  },
  signupBtnText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  signupBtnBold: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  demoBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    gap: 4,
  },
  demoTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  demoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
