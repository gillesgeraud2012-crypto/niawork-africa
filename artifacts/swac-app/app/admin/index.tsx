import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth, type User } from "@/context/AuthContext";

interface UserRecord {
  password: string;
  user: User;
}

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  const loadUsers = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("nia_users_db");
      if (raw) {
        const db: Record<string, UserRecord> = JSON.parse(raw);
        setUsers(Object.values(db));
      }
    } catch {}
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, [loadUsers]);

  // Stats
  const totalUsers = users.length;
  const talents = users.filter(u => u.user.role === "talent").length;
  const artisans = users.filter(u => u.user.role === "artisan").length;
  const entreprises = users.filter(u => u.user.role === "entreprise").length;
  const totalPoints = users.reduce((sum, u) => sum + (u.user.points || 0), 0);

  const handleDeleteUser = (email: string, name: string) => {
    Alert.alert(
      "Supprimer l'utilisateur",
      `Voulez-vous supprimer le compte de ${name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const raw = await AsyncStorage.getItem("nia_users_db");
              if (raw) {
                const db: Record<string, UserRecord> = JSON.parse(raw);
                delete db[email];
                await AsyncStorage.setItem("nia_users_db", JSON.stringify(db));
                await loadUsers();
              }
            } catch {}
          }
        }
      ]
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "#EF4444";
      case "talent": return "#4F6EF7";
      case "artisan": return "#F59E0B";
      case "entreprise": return "#00C17C";
      default: return "#6B7280";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "talent": return "Talent";
      case "artisan": return "Artisan";
      case "entreprise": return "Entreprise";
      default: return role;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={["#EF4444", "#7C4DFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Back-Office Admin</Text>
          <Text style={styles.headerSubtitle}>NIAWORK AFRICA</Text>
        </View>
        <View style={styles.adminBadge}>
          <Feather name="shield" size={14} color="#fff" />
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["overview", "users"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Feather
              name={tab === "overview" ? "bar-chart-2" : "users"}
              size={16}
              color={activeTab === tab ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary }]}>
              {tab === "overview" ? "Vue d'ensemble" : `Utilisateurs (${totalUsers})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === "overview" ? (
          <>
            {/* Bonjour admin */}
            <View style={[styles.welcomeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <LinearGradient colors={["rgba(239,68,68,0.1)", "rgba(124,77,255,0.05)"]} style={StyleSheet.absoluteFill} />
              <Feather name="shield" size={28} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                  Bienvenue, {currentUser?.name?.split(" ")[0]} 👑
                </Text>
                <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>
                  Vous gérez la plateforme NIAWORK AFRICA
                </Text>
              </View>
            </View>

            {/* Stats cards */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistiques</Text>
            <View style={styles.statsGrid}>
              <StatCard icon="users" label="Utilisateurs" value={totalUsers} color="#4F6EF7" colors={colors} />
              <StatCard icon="star" label="Talents" value={talents} color="#4F6EF7" colors={colors} />
              <StatCard icon="tool" label="Artisans" value={artisans} color="#F59E0B" colors={colors} />
              <StatCard icon="briefcase" label="Entreprises" value={entreprises} color="#00C17C" colors={colors} />
            </View>

            <View style={[styles.bigStatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={styles.bigStatIcon}>
                <Feather name="zap" size={22} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={[styles.bigStatValue, { color: colors.text }]}>{totalPoints.toLocaleString()}</Text>
                <Text style={[styles.bigStatLabel, { color: colors.textSecondary }]}>Points distribués au total</Text>
              </View>
            </View>

            {/* Actions rapides */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions rapides</Text>
            <View style={[styles.actionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {[
                { icon: "users", label: "Voir tous les utilisateurs", action: () => setActiveTab("users") },
                { icon: "plus-circle", label: "Ajouter une opportunité", action: () => Alert.alert("Bientôt disponible", "Cette fonctionnalité sera disponible avec le vrai backend.") },
                { icon: "bell", label: "Envoyer une notification", action: () => Alert.alert("Bientôt disponible", "Les notifications push seront activées dans la prochaine version.") },
                { icon: "download", label: "Exporter les données", action: () => Alert.alert("Export", `${totalUsers} utilisateurs, ${totalPoints} points total.`) },
              ].map((item, idx, arr) => (
                <React.Fragment key={item.label}>
                  <Pressable
                    style={({ pressed }) => [styles.actionItem, pressed && { opacity: 0.6 }]}
                    onPress={item.action}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
                      <Feather name={item.icon as any} size={18} color={colors.primary} />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>{item.label}</Text>
                    <Feather name="chevron-right" size={16} color={colors.textTertiary} />
                  </Pressable>
                  {idx < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                </React.Fragment>
              ))}
            </View>

            {/* Info backend */}
            <View style={[styles.infoCard, { backgroundColor: "rgba(245,158,11,0.08)", borderColor: "#F59E0B" }]}>
              <Feather name="info" size={18} color="#F59E0B" />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Les données sont actuellement stockées localement. Le vrai backend avec base de données sera connecté prochainement pour une gestion complète.
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Liste utilisateurs */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {totalUsers} utilisateur{totalUsers !== 1 ? "s" : ""} inscrit{totalUsers !== 1 ? "s" : ""}
            </Text>

            {users.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Feather name="users" size={40} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Aucun utilisateur encore inscrit
                </Text>
              </View>
            ) : (
              users
                .sort((a, b) => new Date(b.user.createdAt).getTime() - new Date(a.user.createdAt).getTime())
                .map((record) => (
                  <View
                    key={record.user.id}
                    style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {record.user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </Text>
                    </LinearGradient>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.userName, { color: colors.text }]}>{record.user.name}</Text>
                      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{record.user.email}</Text>
                      <View style={styles.userMeta}>
                        <View style={[styles.rolePill, { backgroundColor: getRoleBadgeColor(record.user.role) + "20" }]}>
                          <Text style={[styles.roleText, { color: getRoleBadgeColor(record.user.role) }]}>
                            {getRoleLabel(record.user.role)}
                          </Text>
                        </View>
                        <Text style={[styles.userPoints, { color: colors.textSecondary }]}>
                          {record.user.points} pts
                        </Text>
                      </View>
                    </View>
                    {record.user.email !== currentUser?.email && (
                      <Pressable
                        onPress={() => handleDeleteUser(record.user.email, record.user.name)}
                        style={styles.deleteBtn}
                      >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                      </Pressable>
                    )}
                  </View>
                ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, label, value, color, colors }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "15" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  adminBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  tabBar: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#4F6EF7" },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  welcomeCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 20, overflow: "hidden" },
  welcomeTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  welcomeDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  statCard: { width: "48%", borderRadius: 16, padding: 14, gap: 8, borderWidth: 1, alignItems: "flex-start" },
  statIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 26, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bigStatCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 20 },
  bigStatIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  bigStatValue: { fontSize: 28, fontFamily: "Inter_700Bold" },
  bigStatLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  actionsCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden", marginBottom: 16 },
  actionItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  actionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actionLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginLeft: 66 },
  infoCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  emptyCard: { padding: 40, borderRadius: 18, borderWidth: 1, alignItems: "center", gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  userCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  userAvatar: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  userAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  userName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  userEmail: { fontSize: 12, fontFamily: "Inter_400Regular" },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  rolePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  roleText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  userPoints: { fontSize: 12, fontFamily: "Inter_400Regular" },
  deleteBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: "rgba(239,68,68,0.1)", alignItems: "center", justifyContent: "center" },
});
