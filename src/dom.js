export const dom = {
  // Widoki
  views: document.querySelectorAll('.view'),

  // Home
  exerciseList: document.getElementById('exerciseList'),

  // Details
  detailsTitle: document.getElementById('details-title'),
  detailsDesc: document.getElementById('details-desc'),
  detailsParams: document.querySelector('#view-details .params'),
  startFromDetails: document.getElementById('startFromDetails'),

  // Session
  sessionTitle: document.getElementById('session-title'),
  phaseLabel: document.getElementById('phaseLabel'),
  timeLeft: document.getElementById('timeLeft'),
  breathCircle: document.getElementById('breathCircle'),

  // Buttons
  toggleSoundBtn: document.getElementById('toggleSoundBtn'),
  toggleFullscreenBtn: document.getElementById('toggleFullscreenBtn'),
  toggleWakelockBtn: document.getElementById('toggleWakelockBtn'),
  resetSessionBtn: document.getElementById('resetSessionBtn'),
  backToHomeBtn: document.getElementById('backToHomeBtn'),
  backToListBtn: document.getElementById('backToList'),

  container: document.querySelector('.container'),
};
