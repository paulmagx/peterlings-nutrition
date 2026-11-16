export interface FaqItem {
  question: string;
  answer: string;
  /** Offener Klärungspunkt für Lea. Solange gesetzt, bleibt die Frage aus dem JSON-LD draußen. */
  todo?: string;
}

// Antworten sind bewusst allgemein gehalten. Alles, was nur Lea wissen kann,
// steht als todo da und wird nicht sichtbar ausgegeben.
export const faqs: FaqItem[] = [
  {
    question: "Wie läuft der erste Termin ab?",
    answer:
      "Wir lernen uns kennen und sprechen über deine Situation, deinen Alltag und das, was du dir wünschst. Du erzählst, ich höre zu und stelle Fragen. Am Ende überlegen wir gemeinsam, welche nächsten Schritte für dich passen.",
    todo: "TODO(Lea): Ablauf des ersten Termins prüfen (Fragebogen vorab? Zusammenfassung danach?).",
  },
  {
    question: "Muss ich mich auf den Termin vorbereiten?",
    answer:
      "Du musst nichts Besonderes mitbringen. Hilfreich kann sein, dir vorher kurz zu überlegen, was dich beschäftigt und was du dir von der Beratung wünschst. Wenn du magst, kannst du ein paar Tage notieren, was du isst. Das ist aber kein Muss.",
    todo: "TODO(Lea): Gibt es Unterlagen oder einen Fragebogen, die vorab ausgefüllt werden sollen?",
  },
  {
    question: "Findet die Beratung vor Ort oder online statt?",
    answer:
      "Das hängt vom Angebot ab. Schreib mir einfach kurz, dann sage ich dir, welche Möglichkeiten es für dein Anliegen gibt.",
    todo: "TODO(Lea): Pro Leistung klären: vor Ort, online oder beides? Wo ist der Praxisort?",
  },
  {
    question: "Wie lange dauert ein Termin?",
    answer:
      "Das hängt von der Leistung ab. Plane dir für das Gespräch genug Zeit ein, damit wir in Ruhe sprechen können.",
    todo: "TODO(Lea): Dauer je Leistung bestätigen.",
  },
  {
    question: "Was kostet die Beratung und wie bezahle ich?",
    answer:
      "Die Preise findest du bei den einzelnen Leistungen. Wie du bezahlen kannst, besprechen wir bei der Terminvereinbarung.",
    todo: "TODO(Lea): Zahlungsarten (Überweisung, bar, PayPal …) und Rechnungsstellung nennen; Preiswiderspruch 75 € / 89 € klären.",
  },
  {
    question: "Was passiert, wenn ich einen Termin absagen muss?",
    answer:
      "Gib mir bitte so früh wie möglich Bescheid, wenn du nicht kommen kannst. Dann können wir einen neuen Termin finden.",
    todo: "TODO(Lea): Absagefrist und eventuelle Kosten bei kurzfristiger Absage festlegen.",
  },
  {
    question: "Gibt meine Krankenkasse einen Zuschuss?",
    answer:
      "Das kann sein, ist aber nicht selbstverständlich. Manche gesetzlichen Krankenkassen beteiligen sich an Angeboten zur Ernährungsberatung. Ob und in welcher Höhe, entscheidet jede Kasse selbst. Es hängt zum Beispiel davon ab, ob es um Vorbeugung (§ 20 SGB V) oder um eine ergänzende Leistung bei einer Erkrankung (§ 43 SGB V, dafür ist meist eine ärztliche Bescheinigung nötig) geht und welche Qualifikation nachgewiesen werden kann. Frag am besten vorher bei deiner Krankenkasse nach, welche Bedingungen dort gelten.",
    todo: "TODO(Lea): Klären, ob ein Kassenzuschuss bei dir möglich ist (Qualifikation, ZPP-Zertifizierung) und wie die Rechnung aussehen muss. Erst dann konkreter formulieren.",
  },
  {
    question: "Ist die Beratung eine ärztliche Behandlung?",
    answer:
      "Nein. Die Beratung ersetzt keine ärztliche Diagnose oder Behandlung. Wenn du Beschwerden hast oder Medikamente nimmst, sprich bitte vorher mit deiner Ärztin oder deinem Arzt. Ich begleite dich dabei, deine Ernährung im Alltag so zu gestalten, dass sie zu dir passt.",
  },
  {
    question: "Wie gehst du mit meinen Daten um?",
    answer:
      "Ich behandle deine Angaben vertraulich und verwende sie nur, um deine Anfrage zu bearbeiten und die Beratung vorzubereiten. Details findest du in der Datenschutzerklärung.",
  },
  {
    question: "Muss ich eine Diät machen oder auf etwas verzichten?",
    answer:
      "Nein. Es geht nicht um Verbote oder strenge Regeln. Wir schauen gemeinsam, was zu deinem Alltag und deinen Vorlieben passt, und entwickeln daraus kleine Schritte, die du gut umsetzen kannst.",
  },
];
