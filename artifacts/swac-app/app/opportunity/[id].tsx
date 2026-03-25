import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const MOCK_OPPS: Record<string, any> = {
  "1": {
    id: "1", title: "Développeur Junior React Native", company: "TechAfrique CI", type: "emploi",
    location: "Abidjan, Côte d'Ivoire", deadline: "30 Janvier 2026",
    salary: "300 000 – 450 000 FCFA/mois",
    description: "Rejoignez notre équipe de développement mobile. Nous recherchons un développeur junior passionné par les technologies mobiles et prêt à apprendre dans un environnement dynamique.",
    requirements: ["React Native", "JavaScript/TypeScript", "Git", "APIs REST"],
    benefits: ["Formation continue", "Télétravail partiel", "Assurance maladie", "13ème mois"],
  },
  "2": {
    id: "2", title: "Stage Marketing Digital", company: "MediaGroup Sénégal", type: "stage",
    location: "Dakar, Sénégal", deadline: "15 Février 2026",
    salary: "50 000 FCFA/mois",
    description: "Stage de 6 mois dans une agence digitale leader en Afrique de l'Ouest. Vous travaillerez sur des campagnes pour des marques africaines et internationales.",
    requirements: ["Marketing digital", "Réseaux sociaux", "Créativité", "Canva / Photoshop"],
    benefits: ["Expérience internationale", "Mentor dédié", "Attestation de stage", "Possibilité d'embauche"],
  },
  "3": {
    id: "3", title: "Bourse d'Excellence UEMOA 2026", company: "Commission UEMOA", type: "bourse",
    location: "Remote / Pays UEMOA", deadline: "28 Février 2026",
    salary: "1 500 USD/an",
    description: "La Commission UEMOA offre des bourses pour les étudiants en master dans les pays membres. Couvre les frais universitaires et une allocation mensuelle.",
    requirements: ["Ressortissant UEMOA", "Bac+3 minimum", "Moyenne ≥ 14/20", "Moins de 30 ans"],
    benefits: ["Frais de scolarité couverts", "Allocation mensuelle", "Logement", "Billet d'avion"],
  },
};

const TYPE_COLORS: Record<string, [string, string]> = {
  emploi: ["#4F6EF7", "#7C4DFF"],
  stage: ["#7C4DFF", "#5E35B1"],
  bourse: ["#00C17C", "#009960"],
  concours: ["#F59E0B", "#D97706"],
};

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const opp = MOCK_OPPS[id ?? "1"] ?? MOCK_OPPS["1"];
  const gradColors = TYPE_COLORS[opp.type] ?? (["#4F6EF7", "#7C4DFF"] as [string, string]);

  const handleApply = () => {
    Alert.alert(
      "Postuler",
      `Confirmer votre candidature pour "${opp.title}" chez ${opp.company} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            setApplied(true);
            Alert.alert("Candidature envoyée !", "Votre candidature a été soumise avec succès.");
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <Pressable
          style={[styles.saveBtn, { backgroundColor: saved ? colors.primaryLight : colors.surface }]}
          onPress={() => setSaved(!saved)}
        >
          <Feather name="bookmark" size={20} color={saved ? colors.primary : colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <LinearGradient colors={gradColors} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.companyInitials}>
            <Text style={styles.companyInitialsText}>
              {opp.company.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={[styles.typeChip, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.typeChipText}>{opp.type}</Text>
          </View>
          <Text style={styles.heroTitle}>{opp.title}</Text>
          <Text style={styles.heroCompany}>{opp.company}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.metaRow}>
            <MetaTag icon="map-pin" label={opp.location} colors={colors} />
            <MetaTag icon="clock" label={`Expire le ${opp.deadline}`} colors={colors} />
            <MetaTag icon="dollar-sign" label={opp.salary} colors={colors} />
          </View>

          <Section title="Description" colors={colors}>
            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{opp.description}</Text>
          </Section>

          <Section title="Exigences" colors={colors}>
            <View style={styles.tagWrap}>
              {opp.requirements.map((r: string) => (
                <View key={r} style={[styles.reqTag, { backgroundColor: colors.primaryLight }]}>
                  <Feather name="check" size={12} color={colors.primary} />
                  <Text style={[styles.reqText, { color: colors.primary }]}>{r}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Avantages" colors={colors}>
            <View style={{ gap: 10 }}>
              {opp.benefits.map((b: string) => (
                <View key={b} style={styles.benefitRow}>
                  <LinearGradient colors={gradColors} style={styles.benefitDot} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>{b}</Text>
                </View>
              ))}
            </View>
          </Section>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {applied ? (
          <View style={styles.appliedBanner}>
            <Feather name="check-circle" size={20} color="#00C17C" />
            <Text style={styles.appliedText}>Candidature envoyée !</Text>
          </View>
        ) : (
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <LinearGradient colors={gradColors} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <Text style={styles.applyText}>Postuler maintenant</Text>
            <Feather name="send" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function MetaTag({ icon, label, colors }: { icon: any; label: string; colors: any }) {
  return (
    <View style={[styles.metaTag, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Feather name={icon} size={13} color={colors.textSecondary} />
      <Text style={[styles.metaText, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  saveBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  hero: { paddingTop: 80, paddingBottom: 28, paddingHorizontal: 20, gap: 8 },
  companyInitials: { width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  companyInitialsText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  typeChip: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  typeChipText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#fff", textTransform: "capitalize" },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", lineHeight: 30 },
  heroCompany: { fontSize: 14, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.75)" },
  content: { padding: 16, gap: 4 },
  metaRow: { gap: 8, marginBottom: 8 },
  metaTag: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  section: { paddingVertical: 12, gap: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  bodyText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  reqTag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  reqText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  benefitDot: { width: 8, height: 8, borderRadius: 4 },
  benefitText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  applyBtn: { height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, overflow: "hidden" },
  applyText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  appliedBanner: { height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "rgba(0,193,124,0.1)", borderWidth: 1, borderColor: "#00C17C" },
  appliedText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#00C17C" },
});
