import { dom } from './dom.js';
import { PHASE_LABELS } from './consts.js';

export function showView(viewName) {
  dom.views.forEach(v => v.classList.remove('active'));
  const el = document.getElementById(`view-${viewName}`);
  if (el) el.classList.add('active');
}

export function renderExercises(list, onClick) {
  dom.exerciseList.innerHTML = '';

  list.forEach((ex, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${ex.title}</h3><p>${ex.desc}</p>`;
    card.onclick = () => onClick(idx);
    dom.exerciseList.appendChild(card);
  });
}

export function showDetails(exercise) {
  dom.detailsTitle.textContent = exercise.title;
  dom.detailsDesc.textContent = exercise.desc;
  dom.detailsParams.innerHTML = '';

  exercise.pattern.forEach((time, i) => {
    const p = document.createElement('p');
    p.className = 'param';
    p.textContent = `${PHASE_LABELS[i] || 'Faza'}: ${time} s`;
    dom.detailsParams.appendChild(p);
  });
}
