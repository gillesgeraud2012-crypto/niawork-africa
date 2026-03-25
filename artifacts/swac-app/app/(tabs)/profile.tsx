import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

const BADGES_MOCK = [
  { id: "b1", label: "Premier Quiz", icon: "zap", color: "#F59E0B" },
  { id: "b2", label: "Profil Complet", icon: "user-check", color: "#4F6EF7" },
  { id: "b3", label: "Top Chercheur", icon: "search", color: "#00C17C" },
];

const SKILLS_MOCK = ["Développement Web", "React Native", "Node.js", "Design UI"];

const MENU_ITEMS = [
  { icon: "edit-2", label: "Modifier le profil", danger: false, color: "" },
  { icon: "file-text", label: "Mon CV NIAWORK", danger: false, color: "" },
  { icon: "bookmark", label: "Opportunités sauvegardées", danger: false, color: "" },
  { icon: "bar-chart-2", label: "Mes statistiques", danger: false, color: "" },
  { icon: "message-square", label: "Donner mon avis", danger: false, color: "#00C17C", highlight: true },
  { icon: "settings", label: "Paramètres", danger: false, color: "" },
  { icon: "help-circle", label: "Aide & Support", danger: false, color: "" },
  { icon: "log-out", label: "Se déconnecter", danger: true, color: "" },
];

function FeedbackModal({
  visible,
  onClose,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  colors: any;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const CATEGORIES = ["Interface", "Opportunités", "Quiz", "Services", "Messages", "Autre"];

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Note requise", "Veuillez donner une note avant d'envoyer.");
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setCategory(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable
          style={[styles.modalSheet, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.border }]} />

          {submitted ? (
            /* Succès */
            <View style={styles.successContainer}>
              <LinearGradient colors={["#00C17C", "#009960"]} style={styles.successIcon}>
                <Feather name="check" size={32} color="#fff" />
              </LinearGradient>
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Merci pour votre avis !
              </Text>
              <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
                Votre retour nous aide à améliorer NIAWORK AFRICA pour toute la communauté.
              </Text>
              <Pressable style={styles.closeBtn} onPress={handleClose}>
                <LinearGradient
                  colors={["#4F6EF7", "#7C4DFF"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Text style={styles.closeBtnText}>Fermer</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Donner mon avis</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    Votre opinion compte pour nous
                  </Text>
                </View>
                <Pressable onPress={handleClose} style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceAlt }]}>
                  <Feather name="x" size={18} color={colors.textSecondary} />
                </Pressable>
              </View>

              {/* Note étoiles */}
              <View style={styles.ratingSection}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Note générale
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                      <Feather
                        name={star <= rating ? "star" : "star"}
                        size={36}
                        color={star <= rating ? "#F59E0B" : colors.border}
                      />
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                  {rating === 0 && "Appuyez sur une étoile"}
                  {rating === 1 && "😞 Très décevant"}
                  {rating === 2 && "😐 Peut mieux faire"}
                  {rating === 3 && "🙂 Bien, mais améliorable"}
                  {rating === 4 && "😊 Très bien !"}
                  {rating === 5 && "🤩 Excellent ! J'adore !"}
                </Text>
              </View>

              {/* Catégorie */}
              <View style={styles.categorySection}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Quel aspect vous commentez ?
                </Text>
                <View style={styles.categoryRow}>
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      style={[
                        styles.categoryTag,
                        {
                          backgroundColor:
                            category === cat ? colors.primary : colors.surfaceAlt,
                          borderColor:
                            category === cat ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setCategory(category === cat ? null : cat)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: category === cat ? "#fff" : colors.textSecondary },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Commentaire */}
              <View style={styles.commentSection}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Commentaire (optionnel)
                </Text>
                <TextInput
                  style={[
                    styles.commentInput,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Partagez votre expérience, suggestions..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={comment}
                  onChangeText={setComment}
                  maxLength={300}
                />
                <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                  {comment.length}/300
                </Text>
              </View>

              {/* Bouton envoyer */}
              <Pressable
                style={[styles.submitBtn, rating === 0 && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={rating === 0}
              >
                <LinearGradient
                  colors={["#4F6EF7", "#7C4DFF"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Feather name="send" size={18} color="#fff" />
                <Text style={styles.submitText}>Envoyer mon avis</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { user, logout } = useAuth();
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const handleMenuItem = (label: string) => {
    if (label === "Se déconnecter") {
      Alert.alert(
        "Déconnexion",
        "Êtes-vous sûr de vouloir vous déconnecter ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Déconnexion", style: "destructive", onPress: logout },
        ]
      );
    } else if (label === "Donner mon avis") {
      setFeedbackVisible(true);
    }
  };

  const levelProgress = 0.65;

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <LinearGradient
          colors={isDark ? ["#141A35", "#0B0F1A"] : ["#EEF1FE", "#F5F7FA"]}
          style={[styles.headerGrad, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.profileTop}>
            <View style={styles.avatarContainer}>
              <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "U"}
                </Text>
              </LinearGradient>
              <Pressable style={[styles.editAvatarBtn, { backgroundColor: colors.primary }]}>
                <Feather name="camera" size={12} color="#fff" />
              </Pressable>
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name ?? "Utilisateur"}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email ?? ""}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {user?.role === "talent" ? "Talent" : user?.role === "artisan" ? "Artisan" : "Entreprise"}
              </Text>
            </View>
          </View>

          <View style={styles.levelSection}>
            <View style={styles.levelRow}>
              <Text style={[styles.levelLabel, { color: colors.text }]}>
                Niveau {user?.level ?? 1}
              </Text>
              <Text style={[styles.levelPoints, { color: colors.primary }]}>
                {user?.points ?? 0} pts
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <LinearGradient
                colors={["#4F6EF7", "#7C4DFF"]}
                style={[styles.progressFill, { width: `${Math.min(levelProgress * 100, 100)}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={[styles.progressHint, { color: colors.textSecondary }]}>
              {Math.round(levelProgress * 100)}% vers le niveau {(user?.level ?? 1) + 1}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <StatItem value={String(user?.badgeCount ?? 0)} label="Badges" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatItem value={String(user?.level ?? 1)} label="Niveau" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatItem value={String(user?.points ?? 0)} label="Points" colors={colors} />
          </View>
        </LinearGradient>

        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
          <View style={styles.badgesRow}>
            {BADGES_MOCK.map((b) => (
              <View key={b.id} style={[styles.badgeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.badgeIcon, { backgroundColor: `${b.color}20` }]}>
                  <Feather name={b.icon as any} size={20} color={b.color} />
                </View>
                <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Compétences</Text>
          <View style={styles.skillsWrap}>
            {(user?.skills?.length ? user.skills : SKILLS_MOCK).map((s) => (
              <View key={s} style={[styles.skillTag, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.skillText, { color: colors.primary }]}>{s}</Text>
              </View>
            ))}
            <Pressable style={[styles.skillTag, { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderStyle: "dashed", borderColor: colors.border }]}>
              <Feather name="plus" size={12} color={colors.textSecondary} />
              <Text style={[styles.skillText, { color: colors.textSecondary }]}>Ajouter</Text>
            </Pressable>
          </View>
        </View>

        {/* Bannière feedback */}
        <Pressable
          style={[styles.feedbackBanner, { borderColor: "#00C17C" }]}
          onPress={() => setFeedbackVisible(true)}
        >
          <LinearGradient
            colors={["rgba(0,193,124,0.08)", "rgba(0,153,96,0.08)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.feedbackIcon, { backgroundColor: "rgba(0,193,124,0.15)" }]}>
            <Feather name="message-square" size={22} color="#00C17C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.feedbackTitle, { color: colors.text }]}>Donner mon avis</Text>
            <Text style={[styles.feedbackDesc, { color: colors.textSecondary }]}>
              Aidez-nous à améliorer l'app — 1 minute suffit
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#00C17C" />
        </Pressable>

        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {MENU_ITEMS.filter(i => i.label !== "Donner mon avis").map((item, idx, arr) => (
            <React.Fragment key={item.label}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.6 }]}
                onPress={() => handleMenuItem(item.label)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: item.danger ? "rgba(248,81,73,0.1)" : colors.primaryLight }]}>
                  <Feather name={item.icon as any} size={18} color={item.danger ? colors.danger : colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: item.danger ? colors.danger : colors.text }]}>
                  {item.label}
                </Text>
                {!item.danger && <Feather name="chevron-right" size={16} color={colors.textTertiary} />}
              </Pressable>
              {idx < arr.length - 1 && (
                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.version, { color: colors.textTertiary }]}>NIAWORK AFRICA v1.0.0</Text>
      </ScrollView>

      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        colors={colors}
      />
    </>
  );
}

function StatItem({ value, label, colors }: { value: string; label: string; colors: any }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGrad: { paddingHorizontal: 20, paddingBottom: 24, gap: 20 },
  profileTop: { alignItems: "center", gap: 6 },
  avatarContainer: { position: "relative", marginBottom: 4 },
  avatar: { width: 88, height: 88, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#fff" },
  editAvatarBtn: { position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  userName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  userEmail: { fontSize: 13, fontFamily: "Inter_400Regular" },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginTop: 4 },
  roleText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  levelSection: { gap: 8 },
  levelRow: { flexDirection: "row", justifyContent: "space-between" },
  levelLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  levelPoints: { fontSize: 14, fontFamily: "Inter_700Bold" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressHint: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 16 },
  statItem: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  divider: { width: 1, height: 36 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  badgesRow: { flexDirection: "row", gap: 10 },
  badgeCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", gap: 8, borderWidth: 1 },
  badgeIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textAlign: "center" },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillTag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  feedbackBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  feedbackIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  feedbackTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  feedbackDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  menuCard: { marginHorizontal: 16, borderRadius: 20, borderWidth: 1, overflow: "hidden", marginBottom: 16 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  menuDivider: { height: 1, marginLeft: 66 },
  version: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36, gap: 20 },
  handleBar: { width: 40, height: 4, borderRadius: 2, alignSelf: "center" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  modalTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  modalSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 3 },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  ratingSection: { alignItems: "center", gap: 8 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_500Medium", alignSelf: "flex-start" },
  starsRow: { flexDirection: "row", gap: 8 },
  starBtn: { padding: 4 },
  ratingLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  categorySection: { gap: 10 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryTag: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  categoryText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  commentSection: { gap: 8 },
  commentInput: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 100 },
  charCount: { fontSize: 11, fontFamily: "Inter_400Regular", alignSelf: "flex-end" },
  submitBtn: { height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, overflow: "hidden" },
  submitText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  successContainer: { alignItems: "center", paddingVertical: 20, gap: 16 },
  successIcon: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  successDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20, paddingHorizontal: 20 },
  closeBtn: { height: 52, width: "100%", borderRadius: 16, alignItems: "center", justifyContent: "center", overflow: "hidden", marginTop: 8 },
  closeBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
