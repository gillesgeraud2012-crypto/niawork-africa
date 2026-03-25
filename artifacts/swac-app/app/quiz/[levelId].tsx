import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const MOCK_QUESTIONS = [
  {
    id: "q1",
    question: "Quel est le rôle principal d'un CV professionnel ?",
    options: [
      "Lister toutes vos activités personnelles",
      "Présenter vos compétences et expériences pour un poste",
      "Raconter votre histoire de vie",
      "Montrer vos photos de vacances",
    ],
    correct: 1,
  },
  {
    id: "q2",
    question: "Quelle durée est recommandée pour un entretien d'embauche typique ?",
    options: ["5-10 minutes", "15-20 minutes", "30-60 minutes", "2-3 heures"],
    correct: 2,
  },
  {
    id: "q3",
    question: "Quel élément est indispensable dans une lettre de motivation ?",
    options: [
      "Une photo récente",
      "Votre adresse postale complète",
      "Votre motivation pour le poste et l'entreprise",
      "Votre salaire actuel",
    ],
    correct: 2,
  },
  {
    id: "q4",
    question: "Quelle est la bonne attitude lors d'un entretien ?",
    options: [
      "Arriver en retard pour montrer votre liberté",
      "Être ponctuel, souriant et préparé",
      "Poser des questions sur les congés uniquement",
      "Parler de vos problèmes personnels",
    ],
    correct: 1,
  },
  {
    id: "q5",
    question: "NIAWORK AFRICA vise principalement quel continent ?",
    options: ["Europe", "Amérique", "Afrique", "Asie"],
    correct: 2,
  },
];

const TIME_LIMIT = 30;

export default function QuizScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const question = MOCK_QUESTIONS[currentIdx];
  const total = MOCK_QUESTIONS.length;

  const startTimer = useCallback(() => {
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: TIME_LIMIT * 1000,
      useNativeDriver: false,
    }).start();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [progressAnim]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(TIME_LIMIT);
    }
  };

  const getOptionStyle = (idx: number) => {
    if (!answered) return null;
    if (idx === question.correct) return styles.optionCorrect;
    if (idx === selected && idx !== question.correct) return styles.optionWrong;
    return styles.optionDim;
  };

  const getOptionTextColor = (idx: number) => {
    if (!answered) return colors.text;
    if (idx === question.correct) return "#00C17C";
    if (idx === selected && idx !== question.correct) return "#F85149";
    return colors.textTertiary;
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 60;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={passed ? ["#00C17C", "#009960"] : ["#4F6EF7", "#7C4DFF"]}
          style={styles.resultHero}
        >
          <View style={styles.resultIcon}>
            <Feather name={passed ? "award" : "refresh-cw"} size={40} color="#fff" />
          </View>
          <Text style={styles.resultTitle}>{passed ? "Félicitations !" : "Continuez à pratiquer"}</Text>
          <Text style={styles.resultScore}>{score}/{total}</Text>
          <Text style={styles.resultPct}>{pct}%</Text>
        </LinearGradient>
        <View style={styles.resultContent}>
          <Text style={[styles.resultMsg, { color: colors.text }]}>
            {passed
              ? "Vous avez réussi ce niveau ! Vous gagnez 50 points NIAWORK."
              : "Pas encore réussi, mais vous avez fait de bons progrès !"}
          </Text>
          <View style={styles.resultPoints}>
            <LinearGradient colors={["#F59E0B", "#D97706"]} style={styles.pointsBadge}>
              <Feather name="zap" size={16} color="#fff" />
              <Text style={styles.pointsText}>+{score * 10} points</Text>
            </LinearGradient>
          </View>
          <Pressable style={[styles.doneBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Retour aux niveaux</Text>
          </Pressable>
          {!passed && (
            <Pressable
              style={[styles.retryBtn, { borderColor: colors.primary }]}
              onPress={() => {
                setCurrentIdx(0);
                setScore(0);
                setSelected(null);
                setAnswered(false);
                setTimeLeft(TIME_LIMIT);
                setFinished(false);
              }}
            >
              <Text style={[styles.retryBtnText, { color: colors.primary }]}>Réessayer</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={[styles.quizHeader, { paddingTop: insets.top + 12 }]}>
        <View style={styles.quizTopRow}>
          <Pressable onPress={() => router.back()}>
            <Feather name="x" size={22} color="rgba(255,255,255,0.8)" />
          </Pressable>
          <Text style={styles.quizProgressText}>{currentIdx + 1} / {total}</Text>
          <View style={[styles.timerBadge, timeLeft <= 10 && { backgroundColor: "rgba(248,81,73,0.3)" }]}>
            <Feather name="clock" size={14} color="#fff" />
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </LinearGradient>

      <View style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.questionNum, { color: colors.primary }]}>Question {currentIdx + 1}</Text>
        <Text style={[styles.questionText, { color: colors.text }]}>{question.question}</Text>
      </View>

      <View style={styles.options}>
        {question.options.map((opt, idx) => (
          <Pressable
            key={idx}
            style={[
              styles.option,
              { backgroundColor: colors.surface, borderColor: colors.border },
              answered && idx === question.correct && styles.optionCorrect,
              answered && idx === selected && idx !== question.correct && styles.optionWrong,
              answered && idx !== question.correct && idx !== selected && styles.optionDim,
              !answered && selected === idx && { borderColor: colors.primary },
            ]}
            onPress={() => handleAnswer(idx)}
            disabled={answered}
          >
            <View style={[styles.optionLetter, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.optionLetterText, { color: getOptionTextColor(idx) }]}>
                {String.fromCharCode(65 + idx)}
              </Text>
            </View>
            <Text style={[styles.optionText, { color: getOptionTextColor(idx), flex: 1 }]}>{opt}</Text>
            {answered && idx === question.correct && (
              <Feather name="check-circle" size={18} color="#00C17C" />
            )}
            {answered && idx === selected && idx !== question.correct && (
              <Feather name="x-circle" size={18} color="#F85149" />
            )}
          </Pressable>
        ))}
      </View>

      {answered && (
        <View style={[styles.nextRow, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <LinearGradient colors={["#4F6EF7", "#7C4DFF"]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <Text style={styles.nextText}>
              {currentIdx + 1 >= total ? "Voir les résultats" : "Question suivante"}
            </Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  quizHeader: { padding: 16, gap: 14 },
  quizTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  quizProgressText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  timerBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  timerText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
  progressTrack: { height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 3 },
  questionCard: { margin: 16, borderRadius: 20, padding: 20, borderWidth: 1, gap: 10 },
  questionNum: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 1 },
  questionText: { fontSize: 18, fontFamily: "Inter_700Bold", lineHeight: 26 },
  options: { paddingHorizontal: 16, gap: 10 },
  option: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1.5 },
  optionCorrect: { borderColor: "#00C17C", backgroundColor: "rgba(0,193,124,0.08)" },
  optionWrong: { borderColor: "#F85149", backgroundColor: "rgba(248,81,73,0.08)" },
  optionDim: { opacity: 0.5 },
  optionLetter: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  optionLetterText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  optionText: { fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 20 },
  nextRow: { position: "absolute", bottom: 0, left: 16, right: 16 },
  nextBtn: { height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, overflow: "hidden" },
  nextText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  resultHero: { paddingTop: 80, paddingBottom: 40, alignItems: "center", gap: 12 },
  resultIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  resultTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#fff" },
  resultScore: { fontSize: 48, fontFamily: "Inter_700Bold", color: "#fff" },
  resultPct: { fontSize: 18, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)" },
  resultContent: { flex: 1, padding: 24, gap: 20, alignItems: "center" },
  resultMsg: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  resultPoints: { alignItems: "center" },
  pointsBadge: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  pointsText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  doneBtn: { width: "100%", height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  doneBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  retryBtn: { width: "100%", height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  retryBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
