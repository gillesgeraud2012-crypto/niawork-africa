import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const FILTERS = ["Tous", "Emploi", "Stage", "Bourse", "Concours", "Événement"];

const MOCK_OPPS = [
  { id: "1", title: "Développeur Junior React Native", company: "TechAfrique CI", type: "emploi", location: "Abidjan", deadline: "30 Jan 2026", description: "Rejoignez notre équipe de développement mobile." },
  { id: "2", title: "Stage Marketing Digital", company: "MediaGroup Sénégal", type: "stage", location: "Dakar", deadline: "15 Fév 2026", description: "Stage de 6 mois dans une agence digitale leader." },
  { id: "3", title: "Bourse d'Excellence UEMOA 2026", company: "Commission UEMOA", type: "bourse", location: "Remote", deadline: "28 Fév 2026", description: "Bourse pour étudiants en master dans les pays membres." },
  { id: "4", title: "Concours Innovation Africa Tech", company: "AfricaTech", type: "concours", location: "Lagos", deadline: "10 Mar 2026", description: "Compétition pour startups tech africaines." },
  { id: "5", title: "Analyste Données Junior", company: "DataCorp Africa", type: "emploi", location: "Nairobi", deadline: "5 Fév 2026", description: "Poste d'analyste données pour profils analytiques." },
  { id: "6", title: "Stage Design UX/UI", company: "CreativeHub", type: "stage", location: "Lomé", deadline: "20 Fév 2026", description: "Stage pour designers passionnés par l'expérience utilisateur." },
  { id: "7", title: "Forum Emploi Afrique Francophone", company: "ANPE", type: "événement", location: "Cotonou", deadline: "14 Mar 2026", description: "Grand forum réunissant 200+ entreprises recruteurs." },
];

const TYPE_COLORS: Record<string, string> = {
  emploi: "#4F6EF7",
  stage: "#7C4DFF",
  bourse: "#00C17C",
  concours: "#F59E0B",
  événement: "#EF4444",
};

const TYPE_BG: Record<string, string> = {
  emploi: "rgba(79,110,247,0.12)",
  stage: "rgba(124,77,255,0.12)",
  bourse: "rgba(0,193,124,0.12)",
  concours: "rgba(245,158,11,0.12)",
  événement: "rgba(239,68,68,0.12)",
};

export default function OpportunitiesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = MOCK_OPPS.filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "Tous" ||
      o.type === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Opportunités</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    activeFilter === item ? colors.primary : colors.surface,
                  borderColor:
                    activeFilter === item ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === item ? "#fff" : colors.textSecondary },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={40} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun résultat trouvé
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push(`/opportunity/${item.id}`)}
          >
            <View style={styles.cardTop}>
              <View style={[styles.typeTag, { backgroundColor: TYPE_BG[item.type] ?? colors.primaryLight }]}>
                <Text style={[styles.typeText, { color: TYPE_COLORS[item.type] ?? colors.primary }]}>
                  {item.type}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color={colors.textSecondary} />
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>{item.location}</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.cardCompany, { color: colors.textSecondary }]}>{item.company}</Text>
            <Text style={[styles.cardDesc, { color: colors.textTertiary }]} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.deadlineRow}>
                <Feather name="clock" size={12} color={colors.textTertiary} />
                <Text style={[styles.deadlineText, { color: colors.textTertiary }]}>
                  Expire le {item.deadline}
                </Text>
              </View>
              <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={styles.applyBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.applyText}>Postuler</Text>
                <Feather name="arrow-right" size={14} color="#fff" />
              </LinearGradient>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 48 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  card: { borderRadius: 16, padding: 16, gap: 8, borderWidth: 1 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  typeTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "capitalize" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardCompany: { fontSize: 13, fontFamily: "Inter_500Medium" },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  deadlineRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  deadlineText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  applyBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  applyText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
