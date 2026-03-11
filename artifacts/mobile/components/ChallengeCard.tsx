import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Challenge } from "@/contexts/AppDataContext";

interface ChallengeCardProps {
  challenge: Challenge;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function useCountdown(endDate: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) setTimeLeft(`${days}d ${hours}h left`);
      else if (hours > 0) setTimeLeft(`${hours}h ${mins}m left`);
      else setTimeLeft(`${mins}m left`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const timeLeft = useCountdown(challenge.endDate);

  const statusColor =
    challenge.status === "active"
      ? Colors.primary
      : challenge.status === "upcoming"
      ? Colors.accent
      : Colors.textMuted;

  const statusLabel =
    challenge.status === "active"
      ? "LIVE NOW"
      : challenge.status === "upcoming"
      ? "COMING SOON"
      : "ENDED";

  return (
    <AnimatedPressable
      style={[styles.card, animStyle]}
      onPress={() =>
        router.push({ pathname: "/challenge/[id]", params: { id: challenge.id } })
      }
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }}
    >
      {challenge.image && (
        <Image
          source={{ uri: challenge.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      )}

      <View style={styles.overlay}>
        <View style={[styles.statusPill, { borderColor: statusColor }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {challenge.title}
        </Text>

        <View style={styles.prizeRow}>
          <Ionicons name="trophy-outline" size={14} color={Colors.accent} />
          <Text style={styles.prize}>{challenge.prize}</Text>
        </View>

        <View style={styles.footer}>
          {challenge.status !== "ended" && (
            <View style={styles.timeRow}>
              <Feather name="clock" size={12} color={Colors.textMuted} />
              <Text style={styles.timeText}>{timeLeft}</Text>
            </View>
          )}
          {challenge.status === "ended" && challenge.winner && (
            <Text style={styles.winner}>Winner: {challenge.winner}</Text>
          )}
          <View style={styles.participantsRow}>
            <Feather name="users" size={12} color={Colors.textMuted} />
            <Text style={styles.participantsText}>
              {challenge.participantCount} entered
            </Text>
          </View>
        </View>

        {challenge.userParticipated && (
          <View style={styles.enteredBadge}>
            <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
            <Text style={styles.enteredText}>Entered</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.backgroundAlt,
  },
  overlay: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
    lineHeight: 24,
  },
  prizeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  prize: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.accent,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textMuted,
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  participantsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  winner: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.success,
    flex: 1,
  },
  enteredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  enteredText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.success,
  },
});
