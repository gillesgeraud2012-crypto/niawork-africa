import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const QUIZ_LEVELS = [
  { id: "1", num: 1, label: "Bases", desc: "Connaissances fondamentales", questions: 20, duration: 15, unlocked: true, color: ["#4F6EF7", "#7C4DFF"] as [string, string] },
  { id: "2", num: 2, label: "Logique", desc: "Raisonnement et analyse", questions: 25, duration: 20, unlocked: true, color: ["#00C17C", "#009960"] as [string, string] },
  { id: "3", num: 3, label: "Fondamentaux", desc: "Concepts avancés", questions: 30, duration: 25, unlocked: false, color: ["#F59E0B", "#D97706"] as [string, string] },
  { id: "4", num: 4, label: "Applications", desc: "Mise en pratique", questions: 30, duration: 25, unlocked: false, color: ["#EF4444", "#DC2626"] as [string, string] },
  { id: "5", num: 5, label: "Analyse", desc: "Études de cas réels", questions: 40, duration: 35, unlocked: false, color: ["#7C4DFF", "#5E35B1"] as [string, string] },
];

const FORMATIONS = [
  { id: "f1", title: "CV Professionnel Africain", category: "Carrière", duration: 5, type: "texte", icon: "file-text" },
  { id: "f2", title: "Préparer un entretien", category: "Carrière", duration: 3, type: "video", icon: "video" },
  { id: "f3", title: "Marketing Digital Bases", category: "Marketing", duration: 4, type: "video", icon: "trending-up" },
  { id: "f4", title: "Excel pour débutants", category: "Bureautique", duration: 5, type: "texte", icon: "grid" },
  { id: "f5", title: "Entrepreneuriat en Afrique", category: "Business", duration: 4, type: "video", icon: "briefcase" },
  { id: "f6", title: "Communication professionnelle", category: "Soft Skills", duration: 3, type: "texte", icon: "message-circle" },
];

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [tab, setTab] = useState<"quiz" | "formations">("quiz");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Learn</Text>
        <View style={[styles.tabRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable
            style={[styles.tab, tab === "quiz" && styles.tabActive]}
            onPress={() => setTab("quiz")}
          >
            {tab === "quiz" && <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />}
            <Text style={[styles.tabText, { color: tab === "quiz" ? "#fff" : colors.textSecondary }]}>
              Quiz NIAWORK
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === "formations" && styles.tabActive]}
            onPress={() => setTab("formations")}
          >
            {tab === "formations" && <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />}
            <Text style={[styles.tabText, { color: tab === "formations" ? "#fff" : colors.textSecondary }]}>
              Formations
            </Text>
          </Pressable>
        </View>
      </View>

      {tab === "quiz" ? (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.xpBanner, { backgroundColor: colors.primaryLight }]}>
            <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={styles.xpIcon}>
              <Feather name="zap" size={20} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.xpTitle, { color: colors.text }]}>10 niveaux de compétence</Text>
              <Text style={[styles.xpDesc, { color: colors.textSecondary }]}>Progressez et obtenez la certification NIAWORK</Text>
            </View>
          </View>
          {QUIZ_LEVELS.map((lv) => (
            <Pressable
              key={lv.id}
              style={[styles.levelCard, { backgroundColor: colors.surface, borderColor: lv.unlocked ? "transparent" : colors.border }]}
              onPress={() => lv.unlocked && router.push(`/quiz/${lv.id}`)}
              disabled={!lv.unlocked}
            >
              <LinearGradient colors={lv.color} style={styles.levelNumBadge}>
                <Text style={styles.levelNum}>{lv.num}</Text>
              </LinearGradient>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.levelLabel, { color: lv.unlocked ? colors.text : colors.textSecondary }]}>
                  Niveau {lv.num} — {lv.label}
                </Text>
                <Text style={[styles.levelDesc, { color: colors.textSecondary }]}>{lv.desc}</Text>
                <View style={styles.levelMeta}>
                  <View style={styles.metaItem}>
                    <Feather name="help-circle" size={11} color={colors.textTertiary} />
                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>{lv.questions} questions</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={11} color={colors.textTertiary} />
                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>{lv.duration} min</Text>
                  </View>
                </View>
              </View>
              {lv.unlocked ? (
                <LinearGradient colors={lv.color} style={styles.startBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Feather name="play" size={16} color="#fff" />
                </LinearGradient>
              ) : (
                <View style={[styles.lockIcon, { backgroundColor: colors.surfaceAlt }]}>
                  <Feather name="lock" size={16} color={colors.textTertiary} />
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={FORMATIONS}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <Pressable style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border, flex: 1 }]}>
              <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={styles.formIcon}>
                <Feather name={item.icon as any} size={20} color="#fff" />
              </LinearGradient>
              <View style={[styles.formTypeBadge, { backgroundColor: item.type === "video" ? "rgba(239,68,68,0.1)" : colors.primaryLight }]}>
                <Text style={[styles.formTypeText, { color: item.type === "video" ? "#EF4444" : colors.primary }]}>
                  {item.type === "video" ? "Vidéo" : "Article"}
                </Text>
              </View>
              <Text style={[styles.formTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.formCat, { color: colors.textSecondary }]}>{item.category}</Text>
              <View style={styles.formMeta}>
                <Feather name="clock" size={11} color={colors.textTertiary} />
                <Text style={[styles.formDuration, { color: colors.textTertiary }]}>{item.duration} min</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 14 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  tabRow: { flexDirection: "row", borderRadius: 14, padding: 4, borderWidth: 1, overflow: "hidden" },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", overflow: "hidden" },
  tabActive: { overflow: "hidden" },
  tabText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  xpBanner: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 16, padding: 16 },
  xpIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  xpTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  xpDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  levelCard: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 16, padding: 14, borderWidth: 1 },
  levelNumBadge: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  levelNum: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  levelLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  levelDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  levelMeta: { flexDirection: "row", gap: 12, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  startBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  lockIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  formCard: { borderRadius: 16, padding: 14, gap: 8, borderWidth: 1 },
  formIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  formTypeBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  formTypeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  formTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  formCat: { fontSize: 11, fontFamily: "Inter_400Regular" },
  formMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  formDuration: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
