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

const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    name: "TechAfrique CI",
    avatar: "TC",
    avatarColor: ["#4F6EF7", "#7C4DFF"] as [string, string],
    lastMessage: "Votre candidature a été retenue, pouvez-vous...",
    time: "10:24",
    unread: 2,
    type: "recruteur",
    online: true,
  },
  {
    id: "c2",
    name: "Kouassi Brice",
    avatar: "KB",
    avatarColor: ["#00C17C", "#009960"] as [string, string],
    lastMessage: "Je serai disponible demain matin pour la réparation",
    time: "Hier",
    unread: 0,
    type: "artisan",
    online: false,
  },
  {
    id: "c3",
    name: "MediaGroup Sénégal",
    avatar: "MS",
    avatarColor: ["#F59E0B", "#D97706"] as [string, string],
    lastMessage: "Merci pour votre intérêt, notre équipe RH...",
    time: "Mar",
    unread: 1,
    type: "recruteur",
    online: true,
  },
  {
    id: "c4",
    name: "Fatou Diallo",
    avatar: "FD",
    avatarColor: ["#EF4444", "#DC2626"] as [string, string],
    lastMessage: "Bonjour ! J'ai reçu votre demande de service.",
    time: "Lun",
    unread: 0,
    type: "artisan",
    online: true,
  },
  {
    id: "c5",
    name: "Commission UEMOA",
    avatar: "CU",
    avatarColor: ["#7C4DFF", "#5E35B1"] as [string, string],
    lastMessage: "Votre dossier de bourse est en cours d'examen...",
    time: "12/01",
    unread: 0,
    type: "institution",
    online: false,
  },
];

const TYPE_LABELS: Record<string, string> = {
  recruteur: "Recruteur",
  artisan: "Artisan",
  institution: "Institution",
};

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [search, setSearch] = useState("");

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.background }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
            {totalUnread > 0 && (
              <Text style={[styles.unreadHint, { color: colors.textSecondary }]}>
                {totalUnread} non lu{totalUnread > 1 ? "s" : ""}
              </Text>
            )}
          </View>
          <Pressable style={[styles.newChatBtn, { backgroundColor: colors.primaryLight }]}>
            <Feather name="edit" size={18} color={colors.primary} />
          </Pressable>
        </View>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher une conversation..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border, marginLeft: 82 }]} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun message</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Vos conversations avec recruteurs et artisans apparaîtront ici
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.convRow,
              pressed && { backgroundColor: colors.surfaceAlt },
            ]}
            onPress={() => router.push(`/conversation/${item.id}`)}
          >
            <View style={styles.avatarWrap}>
              <LinearGradient colors={item.avatarColor} style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </LinearGradient>
              {item.online && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.convContent}>
              <View style={styles.convTop}>
                <View style={styles.nameRow}>
                  <Text style={[styles.convName, { color: colors.text }]}>{item.name}</Text>
                  <View style={[styles.typeTag, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.typeText, { color: colors.textTertiary }]}>
                      {TYPE_LABELS[item.type]}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.convTime, { color: item.unread > 0 ? colors.primary : colors.textTertiary }]}>
                  {item.time}
                </Text>
              </View>
              <View style={styles.convBottom}>
                <Text
                  style={[
                    styles.convPreview,
                    { color: item.unread > 0 ? colors.text : colors.textSecondary },
                    item.unread > 0 && { fontFamily: "Inter_600SemiBold" },
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  unreadHint: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  newChatBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 48 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  separator: { height: 1 },
  convRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  avatarWrap: { position: "relative" },
  avatar: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: "#00C17C", borderWidth: 2, borderColor: "#0B0F1A" },
  convContent: { flex: 1, gap: 5 },
  convTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  convName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  typeTag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  typeText: { fontSize: 10, fontFamily: "Inter_400Regular" },
  convTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  convBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  convPreview: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: "#4F6EF7", alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
  unreadText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40, gap: 14 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
});
