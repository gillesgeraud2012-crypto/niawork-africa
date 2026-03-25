import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

function AfricaLogo() {
  return (
    <View style={styles.logoOuter}>
      <LinearGradient
        colors={["#1A1F35", "#0D1530"]}
        style={styles.logoCircle}
      />
      {/* Orbit ring */}
      <View style={styles.orbitRing} />
      {/* Africa continent SVG-like shape via View */}
      <View style={styles.logoInner}>
        {/* Simplified Africa shape using nested rounded views */}
        <View style={styles.africaShape}>
          <LinearGradient
            colors={["#F59E0B", "#EF4444"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
        {/* Stars on continent */}
        {[
          { top: 14, left: 14, size: 4 },
          { top: 10, right: 10, size: 3 },
          { top: 28, left: 20, size: 4 },
          { bottom: 18, left: 15, size: 3 },
          { bottom: 10, right: 14, size: 3 },
        ].map((s, i) => (
          <View
            key={i}
            style={[
              styles.star,
              { width: s.size, height: s.size, borderRadius: s.size / 2, top: s.top, left: (s as any).left, right: (s as any).right, bottom: (s as any).bottom },
            ]}
          />
        ))}
      </View>
      {/* Orbit dots */}
      <View style={[styles.orbitDot, { top: -4, left: "50%", marginLeft: -4, backgroundColor: "#F59E0B" }]} />
      <View style={[styles.orbitDot, { right: -4, top: "50%", marginTop: -4, backgroundColor: "#EF4444" }]} />
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={["#0B0F1A", "#0D1530", "#0B0F1A"]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AfricaLogo />
          <Text style={styles.appName}>NIAWORK AFRICA</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>Votre carrière, votre avenir</Text>
            <View style={[styles.taglineLine, { opacity: 0.3 }]} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Bienvenue ! Connectez-vous pour continuer.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.com"
                  placeholderTextColor="#374151"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#374151"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#6B7280" />
                </Pressable>
              </View>
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#F85149" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && { opacity: 0.85 },
                loading && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={["#4F6EF7", "#7C4DFF"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Se connecter</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.footerLink}> S'inscrire</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: "center", marginBottom: 32, gap: 12 },
  logoOuter: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoCircle: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: "rgba(245,158,11,0.3)",
  },
  orbitRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.2)",
    borderStyle: "dashed",
  },
  logoInner: {
    width: 52,
    height: 60,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  africaShape: {
    width: 44,
    height: 56,
    borderRadius: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 22,
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  star: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  orbitDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#F0F6FC",
    letterSpacing: 2,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taglineLine: {
    width: 24,
    height: 1,
    backgroundColor: "#F59E0B",
  },
  tagline: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#131825",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E2A45",
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#F0F6FC", marginBottom: 6 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#8B949E", marginBottom: 28 },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#8B949E" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A2035",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E2A45",
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 52, fontSize: 16, fontFamily: "Inter_400Regular", color: "#F0F6FC" },
  eyeBtn: { padding: 8 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(248,81,73,0.1)",
    borderRadius: 10,
    padding: 12,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#F85149", flex: 1 },
  loginBtn: {
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#4F6EF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#8B949E" },
  footerLink: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#4F6EF7" },
});
