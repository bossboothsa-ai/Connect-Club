import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Post } from "@/contexts/AppDataContext";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";

interface PostCardProps {
  post: Post;
  onReact: (reaction: "heart" | "fire" | "wave") => void;
}

const POST_TYPE_CONFIG = {
  update: { label: "Update", color: Colors.backgroundAlt, textColor: Colors.textSecondary },
  event: { label: "Event", color: "#FFF0F3", textColor: Colors.primary },
  challenge: { label: "Challenge", color: "#FFF5E6", textColor: Colors.accent },
  location: { label: "Live Location", color: "#F0FFF0", textColor: "#5A8A5A" },
  partner: { label: "Partner", color: "#F5F0FF", textColor: "#7A60A8" },
  survey: { label: "Survey", color: "#F0F5FF", textColor: "#5070B0" },
  reminder: { label: "Reminder", color: "#FFF8F0", textColor: "#B07030" },
};

function ReactionButton({
  icon,
  count,
  active,
  onPress,
}: {
  icon: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.35, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable style={styles.reactionBtn} onPress={handlePress}>
        <Text style={[styles.reactionIcon, active && styles.reactionActive]}>
          {icon}
        </Text>
        <Text style={[styles.reactionCount, active && styles.reactionCountActive]}>
          {count}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function PostCard({ post, onReact }: PostCardProps) {
  const config = POST_TYPE_CONFIG[post.type];
  const timeAgo = getTimeAgo(post.createdAt);

  const handleLinkedPress = () => {
    if (post.linkedEventId) {
      router.push({ pathname: "/event/[id]", params: { id: post.linkedEventId } });
    } else if (post.linkedChallengeId) {
      router.push({ pathname: "/challenge/[id]", params: { id: post.linkedChallengeId } });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar name={post.authorName} size={40} />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{post.authorName}</Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>
        <Badge
          label={config.label}
          color={config.color}
          textColor={config.textColor}
          size="sm"
        />
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>

      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      )}

      {(post.linkedEventId || post.linkedChallengeId) && (
        <Pressable style={styles.linkedCta} onPress={handleLinkedPress}>
          <Text style={styles.linkedCtaText}>
            {post.linkedEventId ? "View Event" : "View Challenge"}
          </Text>
          <Feather name="arrow-right" size={14} color={Colors.primary} />
        </Pressable>
      )}

      <View style={styles.reactions}>
        <ReactionButton
          icon="♥"
          count={post.reactions.heart}
          active={post.userReaction === "heart"}
          onPress={() => onReact("heart")}
        />
        <ReactionButton
          icon=""
          count={post.reactions.fire}
          active={post.userReaction === "fire"}
          onPress={() => onReact("fire")}
        />
        <ReactionButton
          icon=""
          count={post.reactions.wave}
          active={post.userReaction === "wave"}
          onPress={() => onReact("wave")}
        />
      </View>
    </View>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 24,
  },
  content: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: Colors.backgroundAlt,
  },
  linkedCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  linkedCtaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.primary,
  },
  reactions: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  reactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 100,
  },
  reactionIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
  reactionActive: {
    opacity: 1,
  },
  reactionCount: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textMuted,
  },
  reactionCountActive: {
    color: Colors.primary,
  },
});
