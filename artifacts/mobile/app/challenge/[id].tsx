import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function Countdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, mins });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <View style={styles.countdownRow}>
      <View style={styles.countdownUnit}>
        <Text style={styles.countdownNum}>{timeLeft.days}</Text>
        <Text style={styles.countdownLabel}>days</Text>
      </View>
      <Text style={styles.countdownSep}>:</Text>
      <View style={styles.countdownUnit}>
        <Text style={styles.countdownNum}>{timeLeft.hours}</Text>
        <Text style={styles.countdownLabel}>hours</Text>
      </View>
      <Text style={styles.countdownSep}>:</Text>
      <View style={styles.countdownUnit}>
        <Text style={styles.countdownNum}>{timeLeft.mins}</Text>
        <Text style={styles.countdownLabel}>mins</Text>
      </View>
    </View>
  );
}

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { challenges, participateChallenge } = useAppData();
  const [formAnswer, setFormAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const challenge = challenges.find((c) => c.id === id);

  if (!challenge) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.notFoundText}>Challenge not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const statusColor =
    challenge.status === "active"
      ? Colors.primary
      : challenge.status === "upcoming"
      ? Colors.accent
      : Colors.textMuted;

  const statusLabel =
    challenge.status === "active"
      ? "LIVE"
      : challenge.status === "upcoming"
      ? "COMING SOON"
      : "ENDED";

  const handleSubmit = async () => {
    if (challenge.requiresForm && !formAnswer.trim()) {
      Alert.alert("Missing entry", "Please write your answer before submitting.");
      return;
    }
    setSubmitting(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTimeout(() => {
      participateChallenge(challenge.id);
      setSubmitting(false);
      setSubmitted(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1200);
  };

  const isEntered = challenge.userParticipated || submitted;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 120),
        }}
      >
        <View style={styles.imageContainer}>
          {challenge.image ? (
            <Image
              source={{ uri: challenge.image }}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <LinearGradient
              colors={[Colors.primary + "30", Colors.accent + "30"]}
              style={styles.heroImage}
            >
              <Ionicons name="trophy" size={60} color={Colors.accent} />
            </LinearGradient>
          )}

          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroGradient}
          />

          <Pressable
            style={[styles.closeBtn, { top: insets.top + (Platform.OS === "web" ? 67 : 16) }]}
            onPress={() => router.back()}
          >
            <Feather name="x" size={20} color="#fff" />
          </Pressable>

          <View style={styles.statusOverlay}>
            <View style={[styles.statusPill, { borderColor: statusColor }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{challenge.title}</Text>

          <View style={styles.prizeCard}>
            <View style={styles.prizeLeft}>
              <Ionicons name="trophy" size={24} color={Colors.accent} />
              <View>
                <Text style={styles.prizeLabel}>Prize</Text>
                <Text style={styles.prizeValue}>{challenge.prize}</Text>
              </View>
            </View>
          </View>

          {challenge.status === "active" && (
            <View style={styles.countdownCard}>
              <Text style={styles.countdownTitle}>Time remaining</Text>
              <Countdown endDate={challenge.endDate} />
            </View>
          )}

          <View style={styles.descSection}>
            <Text style={styles.descTitle}>About this challenge</Text>
            <Text style={styles.description}>{challenge.description}</Text>
          </View>

          <View style={styles.instructionsCard}>
            <View style={styles.instructionsHeader}>
              <Feather name="list" size={16} color={Colors.primary} />
              <Text style={styles.instructionsTitle}>How to enter</Text>
            </View>
            <Text style={styles.instructions}>{challenge.instructions}</Text>
          </View>

          <View style={styles.requirementsRow}>
            <Text style={styles.reqTitle}>Requirements:</Text>
            <View style={styles.reqBadges}>
              {challenge.requiresPhoto && (
                <Badge label="Photo required" color="#FFF5E6" textColor={Colors.accent} />
              )}
              {challenge.requiresQR && (
                <Badge label="QR scan required" color="#F0F5FF" textColor="#4060A0" />
              )}
              {challenge.requiresForm && (
                <Badge label="Written entry" color="#F5F0FF" textColor="#7A60A8" />
              )}
              {!challenge.requiresPhoto && !challenge.requiresQR && !challenge.requiresForm && (
                <Badge label="Just tap to enter" color={Colors.backgroundAlt} textColor={Colors.textSecondary} />
              )}
            </View>
          </View>

          {challenge.status === "ended" && challenge.winner && (
            <View style={styles.winnerCard}>
              <Ionicons name="trophy" size={20} color={Colors.accent} />
              <View>
                <Text style={styles.winnerLabel}>Winner announced!</Text>
                <Text style={styles.winnerName}>{challenge.winner}</Text>
              </View>
            </View>
          )}

          <View style={styles.socialProof}>
            <Feather name="users" size={14} color={Colors.textMuted} />
            <Text style={styles.socialProofText}>
              {challenge.participantCount} people have entered
            </Text>
          </View>

          {challenge.requiresForm && challenge.status === "active" && !isEntered && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Your entry</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Write your answer here..."
                placeholderTextColor={Colors.textMuted}
                value={formAnswer}
                onChangeText={setFormAnswer}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {challenge.status !== "ended" && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
            },
          ]}
        >
          {isEntered ? (
            <View style={styles.enteredBanner}>
              <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
              <View>
                <Text style={styles.enteredTitle}>You're entered!</Text>
                <Text style={styles.enteredSub}>
                  Winners announced after the challenge ends.
                </Text>
              </View>
            </View>
          ) : challenge.status === "active" ? (
            <Button
              title="Enter Challenge"
              onPress={handleSubmit}
              loading={submitting}
              fullWidth
            />
          ) : (
            <View style={styles.upcomingBanner}>
              <Feather name="clock" size={18} color={Colors.accent} />
              <Text style={styles.upcomingText}>
                This challenge hasn't started yet
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.text,
  },
  backLink: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.primary,
  },
  imageContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 240,
    backgroundColor: Colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  heroGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusOverlay: {
    position: "absolute",
    bottom: 14,
    left: 14,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.text,
    lineHeight: 32,
  },
  prizeCard: {
    backgroundColor: "#FFF9F0",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accent + "40",
  },
  prizeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  prizeLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  prizeValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  countdownCard: {
    backgroundColor: "#FFF0F5",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    gap: 10,
    alignItems: "center",
  },
  countdownTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  countdownUnit: {
    alignItems: "center",
    minWidth: 50,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 10,
  },
  countdownNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.primary,
    lineHeight: 32,
  },
  countdownLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  countdownSep: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.primary,
  },
  descSection: {
    gap: 6,
  },
  descTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
  instructionsCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  instructionsTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.primary,
  },
  instructions: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  requirementsRow: {
    gap: 8,
  },
  reqTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  reqBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  winnerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF9F0",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accent + "40",
  },
  winnerLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.accent,
  },
  winnerName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  socialProof: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialProofText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textMuted,
  },
  formSection: {
    gap: 10,
  },
  formTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  formInput: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  enteredBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  enteredTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.success,
  },
  enteredSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  upcomingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF9F0",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accent + "40",
  },
  upcomingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.accent,
  },
});
