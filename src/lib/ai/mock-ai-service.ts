// Mock AI responses for demo purposes
// In production, this would connect to OpenAI, Anthropic, or similar

const RESPONSES: Record<string, string> = {
  sen: `Dobry sen jest kluczowy dla zdrowia! Oto kilka sprawdzonych sposobów na poprawę jakości snu:

**Higiena snu:**
• Kładź się i wstawaj o stałych porach
• Unikaj ekranów 1-2h przed snem
• Utrzymuj temperaturę w sypialni 18-20°C
• Zadbaj o ciemność i ciszę

**Dodatkowe wskazówki:**
• Unikaj kofeiny po 14:00
• Regularna aktywność fizyczna (ale nie tuż przed snem)
• Relaksacyjne techniki: medytacja, głębokie oddechy
• Jeśli nie możesz zasnąć po 20 min, wstań i zrób coś relaksującego

Potrzebujesz więcej szczegółów na któryś z tych punktów?`,

  woda: `Dzienne zapotrzebowanie na wodę zależy od wielu czynników:

**Ogólna zasada:** 30-35 ml na kg masy ciała

**Dla osoby 70kg:** ok. 2,1-2,5 litra dziennie

**Zwiększ spożycie gdy:**
• Ćwiczysz lub jest gorąco
• Jesteś chory (gorączka, wymioty)
• Jesteś w ciąży lub karmisz
• Spożywasz dużo kofeiny lub alkoholu

**Znaki odwodnienia:**
• Ciemny mocz
• Ból głowy
• Zmęczenie
• Suchość w ustach

Zacznij od szklanki wody rano po przebudzeniu i pij regularnie w ciągu dnia!`,

  suplementy: `Suplementy mogą być pomocne, ale bezpieczeństwo jest najważniejsze:

**Zazwyczaj bezpieczne (przy zalecanych dawkach):**
• Witamina D3 (2000-4000 IU) - szczególnie w naszej strefie klimatycznej
• Omega-3 (EPA/DHA) - dla zdrowia serca i mózgu
• Magnez (300-400mg) - na sen i mięśnie
• Probiotyki - dla zdrowia jelit

**Ważne:**
• Skonsultuj z lekarzem przed rozpoczęciem
• Sprawdź interakcje z lekami
• Wybieraj certyfikowane produkty
• Nie przekraczaj zalecanych dawek

**Najlepiej:** Najpierw zrób badania krwi aby sprawdzić niedobory!`,

  stres: `Redukcja stresu jest kluczowa dla zdrowia. Oto sprawdzone metody:

**Szybkie techniki:**
• Głębokie oddychanie (4-7-8: wdech 4s, zatrzymaj 7s, wydech 8s)
• 5 minut medytacji
• Spacer na świeżym powietrzu
• Muzyka relaksacyjna

**Długoterminowe strategie:**
• Regularna aktywność fizyczna
• Ograniczenie kofeiny i alkoholu
• Dbanie o sen (7-9h)
• Budowanie relacji społecznych
• Ustalenie priorytetów i granic

**Kiedy szukać pomocy:**
Jeśli stres wpływa na codzienne funkcjonowanie, rozważ konsultację z psychologiem.

Chcesz żebym przeprowadził Cię przez ćwiczenie oddechowe?`,

  cholesterol: `Cholesterol to woskowata substancja niezbędna dla organizmu, ale wysoki poziom może być groźny.

**Rodzaje:**
• LDL ("zły") - odkłada się w tętnicach
• HDL ("dobry") - usuwa nadmiar cholesterolu
• Trójglicerydy - inny rodzaj tłuszczu we krwi

**Poziomy optymalne:**
• Cholesterol całkowity: < 200 mg/dL
• LDL: < 100 mg/dL
• HDL: > 40 mg/dL (mężczyźni), > 50 mg/dL (kobiety)
• Trójglicerydy: < 150 mg/dL

**Jak obniżyć:**
• Dieta bogata w warzywa, owoce, pełne ziarna
• Ogranicz tłuszcze nasycone i trans
• Regularne ćwiczenia
• Utrata wagi (jeśli nadwaga)
• Rzucenie palenia

Prześlij mi swoje wyniki, a pomogę je zinterpretować!`,

  ćwiczyć: `Częstotliwość ćwiczeń zależy od celów i poziomu:

**Zalecenia WHO dla dorosłych:**
• 150-300 min umiarkowanej aktywności tygodniowo
• LUB 75-150 min intensywnej aktywności
• Plus 2x w tygodniu ćwiczenia siłowe

**Przykładowy plan:**
• Poniedziałek: Trening siłowy (góra)
• Wtorek: Cardio 30 min (spacer, bieg, rower)
• Środa: Odpoczynek lub joga
• Czwartek: Trening siłowy (dół)
• Piątek: Cardio 30 min
• Weekend: Aktywny wypoczynek

**Dla początkujących:**
Zacznij od 3x w tygodniu po 20-30 min, stopniowo zwiększaj.

**Ważne:**
• Rozgrzewka przed każdym treningiem
• Słuchaj swojego ciała
• Dni regeneracji są ważne!

Jaki masz cel treningowy? Mogę zaproponować spersonalizowany plan.`,
};

export function getAIResponse(message: string): Promise<string> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();

      // Match keywords to responses
      if (lowerMessage.includes("sen") || lowerMessage.includes("spać") || lowerMessage.includes("bezsenność")) {
        resolve(RESPONSES.sen);
      } else if (lowerMessage.includes("wod") || lowerMessage.includes("nawodnienie") || lowerMessage.includes("pić")) {
        resolve(RESPONSES.woda);
      } else if (lowerMessage.includes("suplement") || lowerMessage.includes("witamin")) {
        resolve(RESPONSES.suplementy);
      } else if (lowerMessage.includes("stres") || lowerMessage.includes("stresow") || lowerMessage.includes("relaks")) {
        resolve(RESPONSES.stres);
      } else if (lowerMessage.includes("cholesterol") || lowerMessage.includes("lipid")) {
        resolve(RESPONSES.cholesterol);
      } else if (lowerMessage.includes("ćwicz") || lowerMessage.includes("trening") || lowerMessage.includes("aktywność")) {
        resolve(RESPONSES.ćwiczyć);
      } else {
        // Default response
        resolve(`Dziękuję za pytanie! Jako asystent zdrowia mogę pomóc w tematach takich jak:

• **Sen i regeneracja** - jak poprawić jakość snu
• **Nawodnienie** - ile wody pić
• **Suplementacja** - bezpieczne witaminy i minerały
• **Stres** - techniki relaksacyjne
• **Dieta i odżywianie** - zdrowe nawyki
• **Aktywność fizyczna** - plany treningowe
• **Wyniki badań** - interpretacja podstawowych markerów

Zadaj konkretne pytanie, a postaram się pomóc!

Pamiętaj: Moje odpowiedzi są ogólne. W sprawach medycznych zawsze konsultuj się z lekarzem.`);
      }
    }, 1000 + Math.random() * 1000);
  });
}
