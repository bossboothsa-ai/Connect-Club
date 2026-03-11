import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type PostType =
  | "update"
  | "event"
  | "challenge"
  | "location"
  | "partner"
  | "survey"
  | "reminder";

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  image?: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
  reactions: { heart: number; fire: number; wave: number };
  userReaction?: "heart" | "fire" | "wave";
  linkedEventId?: string;
  linkedChallengeId?: string;
}

export type EventStatus = "upcoming" | "live" | "past";

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  isSecretLocation: boolean;
  price: number | "free" | "rsvp";
  spotsLeft?: number;
  totalSpots?: number;
  status: EventStatus;
  tags: string[];
  whatToBring?: string;
  rsvpCount: number;
  userRsvped: boolean;
  userCheckedIn: boolean;
}

export type ChallengeStatus = "active" | "upcoming" | "ended";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  prize: string;
  instructions: string;
  image?: string;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  requiresQR: boolean;
  requiresPhoto: boolean;
  requiresForm: boolean;
  participantCount: number;
  userParticipated: boolean;
  winner?: string;
}

export interface Moment {
  id: string;
  image: string;
  caption?: string;
  authorName: string;
  authorImage?: string;
  eventTitle?: string;
  createdAt: string;
  featured: boolean;
  likes: number;
  userLiked: boolean;
}

export interface Notification {
  id: string;
  type: "event" | "challenge" | "survey" | "winner" | "update" | "checkin" | "partner";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  linkedId?: string;
}

interface AppDataContextType {
  posts: Post[];
  events: Event[];
  challenges: Challenge[];
  moments: Moment[];
  notifications: Notification[];
  isLoading: boolean;
  reactToPost: (postId: string, reaction: "heart" | "fire" | "wave") => void;
  rsvpEvent: (eventId: string) => void;
  checkInEvent: (eventId: string) => void;
  participateChallenge: (challengeId: string) => void;
  likeMoment: (momentId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    type: "update",
    title: "Welcome to Connect Club",
    content:
      "So happy to have you here! This is our new home — a space for us to connect, celebrate, and create memories together. Drop a heart below if you're excited!",
    authorName: "Jenna",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    reactions: { heart: 142, fire: 87, wave: 63 },
  },
  {
    id: "post-2",
    type: "event",
    title: "Boogie & Brunch is BACK",
    content:
      "Our most beloved Sunday experience returns! Think amazing brunch, deep soulful sounds, and the best vibes in London. Limited spots — don't sleep on this one.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    authorName: "Jenna",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reactions: { heart: 234, fire: 156, wave: 89 },
    linkedEventId: "event-1",
  },
  {
    id: "post-3",
    type: "challenge",
    title: "Sauna Rave Challenge — Win 2 tickets!",
    content:
      "Want to come to our exclusive Sauna Rave? Complete this week's challenge and two lucky winners get FREE tickets. Tag me when you're done!",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    authorName: "Jenna",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reactions: { heart: 198, fire: 267, wave: 112 },
    linkedChallengeId: "challenge-1",
  },
  {
    id: "post-4",
    type: "partner",
    title: "Featured: The Alchemy Wellness Space",
    content:
      "So excited to partner with the incredible team at Alchemy! They're offering Connect Club members 20% off all treatments this month. Use code CONNECT at checkout.",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    authorName: "Jenna",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    reactions: { heart: 167, fire: 43, wave: 78 },
  },
  {
    id: "post-5",
    type: "update",
    title: "Secret drop this Friday...",
    content:
      "Something very special is happening Friday evening. Stay close to the app — I'll be posting a live location at 6pm. First 30 people there get a very special surprise.",
    authorName: "Jenna",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    reactions: { heart: 312, fire: 445, wave: 189 },
  },
];

const INITIAL_EVENTS: Event[] = [
  {
    id: "event-1",
    title: "Boogie & Brunch",
    description:
      "Our signature Sunday experience combining the best bottomless brunch with deep soulful house music. Set in a stunning private venue, this is where the Connect Club magic truly lives. Expect incredible food, flowing drinks, and a dance floor that doesn't stop.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    date: "2026-03-22",
    time: "12:00",
    location: "Shoreditch, London",
    isSecretLocation: false,
    price: 45,
    spotsLeft: 12,
    totalSpots: 60,
    status: "upcoming",
    tags: ["Brunch", "Music", "Dance"],
    whatToBring: "Good vibes only! Smart casual dress code.",
    rsvpCount: 48,
    userRsvped: false,
    userCheckedIn: false,
  },
  {
    id: "event-2",
    title: "Sauna Rave",
    description:
      "London's most unique wellness party experience. We take over a private sauna facility and transform it into an intimate rave. Cold plunge, sweat it out, dance, repeat. This is next level self-care meets community.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    date: "2026-03-29",
    time: "19:00",
    location: "Secret Location",
    isSecretLocation: true,
    price: "rsvp",
    spotsLeft: 5,
    totalSpots: 30,
    status: "upcoming",
    tags: ["Wellness", "Sauna", "Dance"],
    whatToBring: "Swimwear, towel, open mind.",
    rsvpCount: 25,
    userRsvped: false,
    userCheckedIn: false,
  },
  {
    id: "event-3",
    title: "Coffee Rave",
    description:
      "Start your week right. Coffee, movement, community. Our morning activation series returns — 90 minutes of pure energy to kick off your Monday. Zero alcohol, 100% good vibes.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    date: "2026-03-17",
    time: "07:30",
    location: "Dalston, London",
    isSecretLocation: false,
    price: "free",
    status: "upcoming",
    tags: ["Morning", "Coffee", "Community"],
    rsvpCount: 67,
    userRsvped: true,
    userCheckedIn: false,
  },
  {
    id: "event-4",
    title: "Breathwork & Brunch",
    description:
      "Start with a 45-minute guided breathwork session led by our resident facilitator, then flow into a beautiful sit-down brunch. Perfect for those looking to deepen their wellness practice while connecting with like-minded souls.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    date: "2026-04-05",
    time: "10:00",
    location: "Notting Hill, London",
    isSecretLocation: false,
    price: 35,
    spotsLeft: 18,
    totalSpots: 25,
    status: "upcoming",
    tags: ["Breathwork", "Wellness", "Brunch"],
    rsvpCount: 7,
    userRsvped: false,
    userCheckedIn: false,
  },
];

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "challenge-1",
    title: "Sauna Rave Ticket Giveaway",
    description: "Win 2 tickets to our exclusive Sauna Rave experience",
    prize: "2x Sauna Rave Tickets (worth £80)",
    instructions:
      "1. Screenshot your Connect Club profile page\n2. Post it to your Instagram Story\n3. Tag @jenna and use #ConnectClub\n4. Submit your story screenshot below\n\nTwo winners will be chosen randomly on Friday at 6pm!",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    status: "active",
    requiresQR: false,
    requiresPhoto: true,
    requiresForm: false,
    participantCount: 89,
    userParticipated: false,
  },
  {
    id: "challenge-2",
    title: "Find Jenna at Saunders",
    description: "Show up at the right place at the right time",
    prize: "VIP table at next Boogie & Brunch",
    instructions:
      "Jenna will be at Saunders Café on Columbia Road between 10am and 11am this Saturday. Show up, scan her QR code, and you're entered to win!",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    status: "upcoming",
    requiresQR: true,
    requiresPhoto: false,
    requiresForm: false,
    participantCount: 0,
    userParticipated: false,
  },
  {
    id: "challenge-3",
    title: "Boat Cruise Essay Challenge",
    description: "Tell us why you deserve a spot on the yacht",
    prize: "2x Yacht Cruise Tickets (worth £150)",
    instructions:
      "In 100 words or less, tell us why you'd be the perfect person to join our exclusive yacht experience. Be creative, be honest, be you!",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 48 * 5).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "ended",
    requiresQR: false,
    requiresPhoto: false,
    requiresForm: true,
    participantCount: 234,
    userParticipated: false,
    winner: "Sofia Martinez & friends",
  },
];

const INITIAL_MOMENTS: Moment[] = [
  {
    id: "moment-1",
    image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80",
    caption: "Boogie & Brunch vibes never miss",
    authorName: "Sofia M.",
    eventTitle: "Boogie & Brunch",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    featured: true,
    likes: 87,
    userLiked: false,
  },
  {
    id: "moment-2",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
    caption: "The morning crew at Coffee Rave",
    authorName: "Maya K.",
    eventTitle: "Coffee Rave",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    featured: true,
    likes: 134,
    userLiked: false,
  },
  {
    id: "moment-3",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    caption: "Best brunch in London",
    authorName: "Priya S.",
    eventTitle: "Boogie & Brunch",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    featured: false,
    likes: 56,
    userLiked: false,
  },
  {
    id: "moment-4",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    caption: "The dance floor never lies",
    authorName: "Aisha T.",
    eventTitle: "Boogie & Brunch",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    featured: true,
    likes: 203,
    userLiked: false,
  },
  {
    id: "moment-5",
    image: "https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&q=80",
    caption: "Sauna rave was otherworldly",
    authorName: "Lena W.",
    eventTitle: "Sauna Rave",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    featured: false,
    likes: 91,
    userLiked: false,
  },
  {
    id: "moment-6",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    caption: "Community goals",
    authorName: "Zara B.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    featured: false,
    likes: 167,
    userLiked: false,
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "event",
    title: "New Event: Boogie & Brunch",
    body: "Jenna just announced Boogie & Brunch on March 22nd. Only 12 spots left!",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "notif-2",
    type: "challenge",
    title: "New Challenge: Win Sauna Rave Tickets",
    body: "A new giveaway challenge is live! Enter before Friday.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
  },
  {
    id: "notif-3",
    type: "update",
    title: "Secret drop this Friday",
    body: "Jenna posted a teaser — something special is happening. Stay tuned!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: false,
  },
  {
    id: "notif-4",
    type: "winner",
    title: "Yacht Challenge Winners Announced",
    body: "Congratulations to Sofia Martinez! Check the Challenges section for details.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "notif-5",
    type: "partner",
    title: "Exclusive: 20% off at Alchemy",
    body: "Jenna's new partner Alchemy Wellness is offering members a special discount.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
  },
];

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);

  const reactToPost = useCallback((postId: string, reaction: "heart" | "fire" | "wave") => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const hadReaction = p.userReaction === reaction;
        return {
          ...p,
          userReaction: hadReaction ? undefined : reaction,
          reactions: {
            ...p.reactions,
            [reaction]: hadReaction ? p.reactions[reaction] - 1 : p.reactions[reaction] + 1,
            ...(p.userReaction && p.userReaction !== reaction
              ? { [p.userReaction]: p.reactions[p.userReaction] - 1 }
              : {}),
          },
        };
      })
    );
  }, []);

  const rsvpEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              userRsvped: !e.userRsvped,
              rsvpCount: e.userRsvped ? e.rsvpCount - 1 : e.rsvpCount + 1,
              spotsLeft: e.spotsLeft !== undefined
                ? e.userRsvped ? e.spotsLeft + 1 : e.spotsLeft - 1
                : undefined,
            }
          : e
      )
    );
  }, []);

  const checkInEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, userCheckedIn: true } : e
      )
    );
  }, []);

  const participateChallenge = useCallback((challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? { ...c, userParticipated: true, participantCount: c.participantCount + 1 }
          : c
      )
    );
  }, []);

  const likeMoment = useCallback((momentId: string) => {
    setMoments((prev) =>
      prev.map((m) =>
        m.id === momentId
          ? {
              ...m,
              userLiked: !m.userLiked,
              likes: m.userLiked ? m.likes - 1 : m.likes + 1,
            }
          : m
      )
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppDataContext.Provider
      value={{
        posts,
        events,
        challenges,
        moments,
        notifications,
        isLoading,
        reactToPost,
        rsvpEvent,
        checkInEvent,
        participateChallenge,
        likeMoment,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
