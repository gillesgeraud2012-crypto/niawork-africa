import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

const QUIZ_LEVELS = [
  { num: 1, label: "Bases", unlocked: true },
  { num: 2, label: "Logique", unlocked: true },
  { num: 3, label: "Fondamentaux", unlocked: false },
];

const RECENT_OPPS = [
  { id: "1", title: "Développeur Junior", company: "TechAfrique", type: "emploi", location: "Abidjan" },
  { id: "2", title: "Stage Marketing Digital", company: "MediaGroup", type: "stage", location: "Dakar" },
  { id: "3", title: "Bourse Excellence 2026", company: "UEMOA", type: "bourse", location: "Remote" },
];

const TYPE_COLORS: Record<string, [string, string]> = {
  emploi: ["#4F6EF7", "#3A55D4"],
  stage: ["#7C4DFF", "#5E35B1"],
  bourse: ["#00C17C", "#009960"],
  concours: ["#F59E0B", "#D97706"],
  événement: ["#EF4444", "#DC2626"],
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 17) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <LinearGradient
        colors={isDark ? ["#0D1530", "#0B0F1A"] : ["#EEF1FE", "#F5F7FA"]}
        style={styles.headerGrad}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greeting()},
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name?.split(" ")[0] ?? "Talent"} 👋
            </Text>
          </View>
          <View style={[styles.notifBtn, { backgroundColor: colors.surface }]}>
            <Feather name="bell" size={20} color={colors.textSecondary} />
          </View>
        </View>

        <View style={[styles.statsRow, { marginTop: 20, marginBottom: 24 }]}>
          <StatCard icon="zap" label="Points" value={`${user?.points ?? 0}`} colors={["#4F6EF7", "#7C4DFF"]} />
          <StatCard icon="award" label="Niveau" value={`${user?.level ?? 1}`} colors={["#00C17C", "#009960"]} />
          <StatCard icon="star" label="Badges" value={`${user?.badgeCount ?? 0}`} colors={["#F59E0B", "#D97706"]} />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quiz NIAWORK</Text>
          <Pressable onPress={() => router.push("/(tabs)/learn")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Voir tout</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 2 }}>
          {QUIZ_LEVELS.map((lv) => (
            <Pressable
              key={lv.num}
              style={[styles.quizCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => lv.unlocked && router.push(`/quiz/${lv.num}`)}
              disabled={!lv.unlocked}
            >
              {!lv.unlocked && <View style={styles.quizLock}><Feather name="lock" size={16} color="#fff" /></View>}
              <LinearGradient
                colors={lv.unlocked ? ["#4F6EF7", "#7C4DFF"] : ["#374151", "#1F2937"]}
                style={styles.quizLevelBadge}
              >
                <Text style={styles.quizLevelNum}>{lv.num}</Text>
              </LinearGradient>
              <Text style={[styles.quizLevelLabel, { color: lv.unlocked ? colors.text : colors.textTertiary }]}>
                {lv.label}
              </Text>
              <Text style={[styles.quizSubLabel, { color: colors.textSecondary }]}>
                {lv.unlocked ? "Disponible" : "Verrouillé"}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Opportunités récentes</Text>
          <Pressable onPress={() => router.push("/(tabs)/opportunities")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Voir tout</Text>
          </Pressable>
        </View>
        <View style={{ gap: 12 }}>
          {RECENT_OPPS.map((opp) => (
            <Pressable
              key={opp.id}
              style={[styles.oppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(`/opportunity/${opp.id}`)}
            >
              <View style={styles.oppLeft}>
                <LinearGradient
                  colors={TYPE_COLORS[opp.type] ?? ["#4F6EF7", "#7C4DFF"]}
                  style={styles.oppTypeDot}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.oppTitle, { color: colors.text }]}>{opp.title}</Text>
                  <Text style={[styles.oppCompany, { color: colors.textSecondary }]}>{opp.company} · {opp.location}</Text>
                </View>
              </View>
              <View style={[styles.oppTag, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.oppTagText, { color: colors.primary }]}>{opp.type}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, colors: gradColors }: { icon: any; label: string; value: string; colors: [string, string] }) {
  return (
    <View style={styles.statCard}>
      <LinearGradient colors={gradColors} style={styles.statIcon}>
        <Feather name={icon} size={16} color="#fff" />
      </LinearGradient>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGrad: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  userName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  notifBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 14 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#F0F6FC" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#8B949E" },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  quizCard: { width: 130, borderRadius: 16, padding: 14, gap: 10, borderWidth: 1, alignItems: "flex-start", overflow: "hidden" },
  quizLock: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1, alignItems: "center", justifyContent: "center" },
  quizLevelBadge: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  quizLevelNum: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  quizLevelLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  quizSubLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  oppCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 14, padding: 14, borderWidth: 1, gap: 12 },
  oppLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  oppTypeDot: { width: 10, height: 10, borderRadius: 5 },
  oppTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  oppCompany: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  oppTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  oppTagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
});
