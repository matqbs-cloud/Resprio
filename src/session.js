import { PHASE_LABELS, PREP_TIME_MS } from './consts.js';
import { dom } from './dom.js';

const SOUNDS = {
  Wdech: new Audio('sounds/inhale.mp3'),
  Wydech: new Audio('sounds/exhale.mp3'),
  Zatrzymaj: new Audio('sounds/hold.mp3'),
};

let state = { intervalId: null, soundOn: true, exercise: null };

const play = (label) => {
  if (!state.soundOn) return;
  // Jeśli label to nie "Wdech" ani "Wydech", użyj dźwięku "Zatrzymaj"
  const audio = SOUNDS[label] || SOUNDS.Zatrzymaj;
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export const toggleSound = () => (state.soundOn = !state.soundOn);

export const stopSession = () => {
  clearInterval(state.intervalId);
  dom.timeLeft.textContent = '—';
  dom.phaseLabel.textContent = '';
  
  // Reset wyglądu koła do stanu początkowego
  dom.breathCircle.className = 'circle';
  
  state.exercise = null;
};

export const startSession = (exercise) => {
  if (!exercise?.pattern) return;
  state.exercise = exercise;
  
  dom.sessionTitle.textContent = exercise.title;
  runPhase(-1); // Start od fazy przygotowania
};

function runPhase(phaseIndex) {
  // Czyścimy poprzedni licznik
  clearInterval(state.intervalId);

  const isPrep = phaseIndex === -1;
  const duration = isPrep ? PREP_TIME_MS / 1000 : state.exercise.pattern[phaseIndex];
  
  // Ustalanie etykiety
  const label = isPrep ? 'Przygotuj się' : PHASE_LABELS[phaseIndex];
  dom.phaseLabel.textContent = label;

  // --- LOGIKA GRAFICZNA (CSS) ---
  const circle = dom.breathCircle;
  // Resetujemy klasy do samej bazowej 'circle'
  circle.className = 'circle';

  if (isPrep) {
    // Podczas przygotowania używamy stylu "hold" (neutralny)
    circle.classList.add('hold');
  } else {
    // Analiza tekstu etykiety, aby dobrać wygląd
    if (label.includes('Wdech')) {
      circle.classList.add('inhale');
    } else if (label.includes('Wydech')) {
      circle.classList.add('exhale');
    } else {
      circle.classList.add('hold');
    }
  }
  // ------------------------------

  // Odtwórz dźwięk (jeśli to nie przygotowanie)
  if (!isPrep) play(label);

  // Timer (setInterval)
  let secondsLeft = duration;
  dom.timeLeft.textContent = secondsLeft;

  state.intervalId = setInterval(() => {
    secondsLeft--;

    if (secondsLeft <= 0) {
      // Przejście do następnej fazy
      const nextIdx = (phaseIndex + 1) % state.exercise.pattern.length;
      runPhase(nextIdx);
    } else {
      // Aktualizacja czasu na ekranie
      dom.timeLeft.textContent = secondsLeft;
    }
  }, 1000);
}