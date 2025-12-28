import { showView, renderExercises, showDetails } from './ui.js';
import { startSession, stopSession, toggleSound } from './session.js';
import { NativeFeatures } from './native.js';
import { VIEW_HOME, VIEW_DETAILS, VIEW_SESSION } from './consts.js';
import { exercises } from './exercises.js';
import { dom } from './dom.js';

let currentExercise = null;

function openDetails(index) {
  currentExercise = exercises[index];
  showDetails(currentExercise);
  showView(VIEW_DETAILS);
}

async function stopAndGo(view) {
  stopSession();
  showView(view);

  if (NativeFeatures.isFullscreen) {
    await NativeFeatures.toggleFullscreen(dom.container);
    dom.toggleFullscreenBtn.textContent = 'Pełny ekran';
  }
}

function init() {
  renderExercises(exercises, openDetails);

  dom.toggleSoundBtn.onclick = () => {
    const enabled = toggleSound();
    dom.toggleSoundBtn.textContent = enabled ? 'Dźwięki WŁ.' : 'Dźwięki WYŁ.';
  };

  dom.toggleWakelockBtn.onclick = async () => {
    await NativeFeatures.enableWakeLock(!NativeFeatures.keepScreenOn);
    dom.toggleWakelockBtn.textContent =
      NativeFeatures.keepScreenOn
        ? 'Blokada ekranu WŁ.'
        : 'Blokada ekranu WYŁ.';
  };

  dom.toggleFullscreenBtn.onclick = async () => {
    const fs = await NativeFeatures.toggleFullscreen(dom.container);
    dom.toggleFullscreenBtn.textContent = fs
      ? 'Wyłącz pełny ekran'
      : 'Pełny ekran';
  };

  dom.startFromDetails.onclick = () => {
    if (!currentExercise) return;
    startSession(currentExercise);
    showView(VIEW_SESSION);
  };

  dom.resetSessionBtn.onclick = () => stopAndGo(VIEW_DETAILS);
  dom.backToHomeBtn.onclick = () => stopAndGo(VIEW_HOME);
  dom.backToListBtn.onclick = () => showView(VIEW_HOME);

  showView(VIEW_HOME);
}

init();
