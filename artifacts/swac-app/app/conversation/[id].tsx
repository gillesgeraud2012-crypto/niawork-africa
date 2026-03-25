import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const MOCK_DATA: Record<string, { name: string; avatar: string; avatarColor: [string, string]; type: string; messages: any[] }> = {
  c1: {
    name: "TechAfrique CI",
    avatar: "TC",
    avatarColor: ["#4F6EF7", "#7C4DFF"],
    type: "Recruteur",
    messages: [
      { id: "m1", text: "Bonjour ! Nous avons bien reçu votre candidature pour le poste de Développeur Junior.", mine: false, time: "10:00" },
      { id: "m2", text: "Bonjour ! Merci beaucoup, je suis vraiment intéressé par ce poste.", mine: true, time: "10:05" },
      { id: "m3", text: "Excellent ! Votre profil correspond bien à ce que nous cherchons.", mine: false, time: "10:08" },
      { id: "m4", text: "Votre candidature a été retenue, pouvez-vous nous donner vos disponibilités pour un entretien la semaine prochaine ?", mine: false, time: "10:24" },
    ],
  },
  c2: {
    name: "Kouassi Brice",
    avatar: "KB",
    avatarColor: ["#00C17C", "#009960"],
    type: "Artisan Plombier",
    messages: [
      { id: "m1", text: "Bonjour, j'ai vu votre demande pour une réparation de plomberie.", mine: false, time: "09:00" },
      { id: "m2", text: "Oui, j'ai une fuite sous l'évier de cuisine.", mine: true, time: "09:10" },
      { id: "m3", text: "D'accord, c'est une réparation courante. Mon tarif est 15 000 FCFA/h.", mine: false, time: "09:15" },
      { id: "m4", text: "C'est parfait, quand êtes-vous disponible ?", mine: true, time: "09:20" },
      { id: "m5", text: "Je serai disponible demain matin pour la réparation", mine: false, time: "Hier" },
    ],
  },
  c3: {
    name: "MediaGroup Sénégal",
    avatar: "MS",
    avatarColor: ["#F59E0B", "#D97706"],
    type: "Recruteur",
    messages: [
      { id: "m1", text: "Bonjour, nous avons reçu votre candidature pour le stage Marketing Digital.", mine: false, time: "Mar" },
      { id: "m2", text: "Merci pour votre intérêt, notre équipe RH vous contactera prochainement.", mine: false, time: "Mar" },
    ],
  },
};

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const flatRef = useRef<FlatList>(null);

  const conv = MOCK_DATA[id ?? "c1"] ?? MOCK_DATA["c1"];
  const [messages, setMessages] = useState(conv.messages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, text: input.trim(), mine: true, time },
    ]);
    setInput("");
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient
        colors={isDark ? ["#0D1530", "#0B0F1A"] : ["#EEF1FE", "#F5F7FA"]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <LinearGradient colors={conv.avatarColor} style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{conv.avatar}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerName, { color: colors.text }]}>{conv.name}</Text>
          <Text style={[styles.headerType, { color: colors.textSecondary }]}>{conv.type}</Text>
        </View>
        <Pressable style={[styles.callBtn, { backgroundColor: colors.surface }]}>
          <Feather name="phone" size={18} color={colors.primary} />
        </Pressable>
        <Pressable style={[styles.callBtn, { backgroundColor: colors.surface }]}>
          <Feather name="more-vertical" size={18} color={colors.textSecondary} />
        </Pressable>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onLayout={() => flatRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item, index }) => {
          const showAvatar = !item.mine && (index === 0 || messages[index - 1]?.mine);
          return (
            <View style={[styles.msgRow, item.mine && styles.msgRowMine]}>
              {!item.mine && (
                <View style={[styles.msgAvatarSmall, !showAvatar && { opacity: 0 }]}>
                  <LinearGradient colors={conv.avatarColor} style={StyleSheet.absoluteFill} />
                  <Text style={styles.msgAvatarText}>{conv.avatar[0]}</Text>
                </View>
              )}
              <View style={styles.msgBubbleWrap}>
                {item.mine ? (
                  <LinearGradient
                    colors={["#4F6EF7", "#7C4DFF"]}
                    style={[styles.bubble, styles.bubbleMine]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.bubbleTextMine}>{item.text}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.bubble, styles.bubbleOther, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.bubbleText, { color: colors.text }]}>{item.text}</Text>
                  </View>
                )}
                <Text style={[styles.msgTime, { color: colors.textTertiary }, item.mine && { alignSelf: "flex-end" }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable style={[styles.attachBtn, { backgroundColor: colors.surface }]}>
          <Feather name="paperclip" size={18} color={colors.textSecondary} />
        </Pressable>
        <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Écrire un message..."
            placeholderTextColor={colors.textTertiary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
        </View>
        <Pressable
          style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <Feather name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerAvatar: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  headerAvatarText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  headerName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  headerType: { fontSize: 11, fontFamily: "Inter_400Regular" },
  callBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  msgRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  msgRowMine: { flexDirection: "row-reverse" },
  msgAvatarSmall: { width: 28, height: 28, borderRadius: 9, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  msgAvatarText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  msgBubbleWrap: { maxWidth: "75%", gap: 4 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleOther: { borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bubbleTextMine: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20, color: "#fff" },
  msgTime: { fontSize: 10, fontFamily: "Inter_400Regular" },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 8, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1 },
  attachBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  inputWrap: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, minHeight: 42, maxHeight: 100 },
  input: { fontSize: 15, fontFamily: "Inter_400Regular" },
  sendBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", overflow: "hidden" },
});
