import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

const CATEGORIES = [
  { id: "1", label: "Plomberie", icon: "droplet", color: ["#4F6EF7", "#7C4DFF"] as [string, string] },
  { id: "2", label: "Électricité", icon: "zap", color: ["#F59E0B", "#D97706"] as [string, string] },
  { id: "3", label: "Mécanique", icon: "tool", color: ["#EF4444", "#DC2626"] as [string, string] },
  { id: "4", label: "Informatique", icon: "monitor", color: ["#00C17C", "#009960"] as [string, string] },
  { id: "5", label: "Transport", icon: "truck", color: ["#7C4DFF", "#5E35B1"] as [string, string] },
  { id: "6", label: "Réparation", icon: "settings", color: ["#06B6D4", "#0891B2"] as [string, string] },
  { id: "7", label: "Menuiserie", icon: "box", color: ["#A16207", "#854D0E"] as [string, string] },
  { id: "8", label: "Peinture", icon: "edit-3", color: ["#EC4899", "#DB2777"] as [string, string] },
];

const MOCK_ARTISANS = [
  { id: "a1", name: "Kouassi Brice", specialty: "Plombier", city: "Abidjan", rating: 4.8, reviews: 47, price: "15 000 FCFA/h", verified: true },
  { id: "a2", name: "Fatou Diallo", specialty: "Électricienne", city: "Dakar", rating: 4.9, reviews: 62, price: "12 000 FCFA/h", verified: true },
  { id: "a3", name: "Moussa Traoré", specialty: "Mécanicien", city: "Bamako", rating: 4.6, reviews: 33, price: "10 000 FCFA/h", verified: false },
  { id: "a4", name: "Ahmed Hassan", specialty: "Technicien IT", city: "Dakar", rating: 5.0, reviews: 28, price: "20 000 FCFA/h", verified: true },
  { id: "a5", name: "Amina Ouédraogo", specialty: "Plombière", city: "Ouagadougou", rating: 4.7, reviews: 19, price: "12 000 FCFA/h", verified: true },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filtered = MOCK_ARTISANS.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat ||
      a.specialty.toLowerCase().includes(
        CATEGORIES.find((c) => c.id === selectedCat)?.label.toLowerCase().slice(0, 4) ?? ""
      );
    return matchSearch && matchCat;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.background }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Services</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Trouvez un artisan de confiance</Text>
          </View>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]}>
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher un service..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={["categories", ...filtered.map((a) => a.id)]}
        keyExtractor={(i) => i}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          if (item === "categories") {
            return (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>Catégories</Text>
                <View style={styles.catGrid}>
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
                      style={[
                        styles.catCard,
                        {
                          backgroundColor:
                            selectedCat === cat.id ? "transparent" : colors.surface,
                          borderColor:
                            selectedCat === cat.id ? cat.color[0] : colors.border,
                          overflow: "hidden",
                        },
                      ]}
                    >
                      {selectedCat === cat.id && (
                        <LinearGradient
                          colors={cat.color}
                          style={StyleSheet.absoluteFill}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        />
                      )}
                      <Feather
                        name={cat.icon as any}
                        size={22}
                        color={selectedCat === cat.id ? "#fff" : cat.color[0]}
                      />
                      <Text
                        style={[
                          styles.catLabel,
                          { color: selectedCat === cat.id ? "#fff" : colors.text },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 8 }]}>
                  Artisans disponibles ({filtered.length})
                </Text>
              </View>
            );
          }
          const artisan = MOCK_ARTISANS.find((a) => a.id === item);
          if (!artisan) return null;
          return (
            <Pressable style={[styles.artisanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.artisanTop}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {artisan.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.artisanName, { color: colors.text }]}>{artisan.name}</Text>
                    {artisan.verified && (
                      <View style={styles.verifiedBadge}>
                        <Feather name="check-circle" size={12} color="#00C17C" />
                        <Text style={styles.verifiedText}>Vérifié</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.artisanSpecialty, { color: colors.textSecondary }]}>{artisan.specialty}</Text>
                  <View style={styles.locationRow}>
                    <Feather name="map-pin" size={11} color={colors.textTertiary} />
                    <Text style={[styles.artisanCity, { color: colors.textTertiary }]}>{artisan.city}</Text>
                  </View>
                </View>
                <View style={styles.ratingBox}>
                  <Feather name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{artisan.rating}</Text>
                </View>
              </View>
              <View style={styles.artisanFooter}>
                <View style={[styles.reviewTag, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.reviewText, { color: colors.textSecondary }]}>{artisan.reviews} avis</Text>
                </View>
                <Text style={[styles.priceText, { color: colors.text }]}>{artisan.price}</Text>
                <Pressable style={styles.contactBtn}>
                  <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                  <Text style={styles.contactText}>Contacter</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  addBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 48 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  sectionLabel: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  catCard: { width: "22%", aspectRatio: 1, borderRadius: 14, alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1 },
  catLabel: { fontSize: 9, fontFamily: "Inter_500Medium", textAlign: "center" },
  artisanCard: { borderRadius: 16, padding: 14, gap: 12, borderWidth: 1 },
  artisanTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  artisanName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  verifiedText: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#00C17C" },
  artisanSpecialty: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  artisanCity: { fontSize: 12, fontFamily: "Inter_400Regular" },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#F59E0B" },
  artisanFooter: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  reviewText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  priceText: { flex: 1, fontSize: 12, fontFamily: "Inter_600SemiBold" },
  contactBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, overflow: "hidden" },
  contactText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
