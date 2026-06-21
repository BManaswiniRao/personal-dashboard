// ── Diet Tracker Card ───────────────────────────────────────

export function DietCard({ dietToday, onAdd, onDelete }) {
  const el = document.createElement('div');
  el.className = 'card';

  const avgMood = dietToday.length > 0
    ? Math.round(dietToday.reduce((sum, d) => sum + d.mood, 0) / dietToday.length)
    : 0;

  const moodEmoji = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }[avgMood] || '🤷';

  el.innerHTML = `
    <div class="card-header">
      <h2>🥗 Diet Tracker</h2>
      <span class="badge">${avgMood > 0 ? moodEmoji + ' ' + avgMood + '/5' : 'No entries'}</span>
    </div>

    <div class="diet-entries">
      ${dietToday.length === 0 ? '<p class="empty">No meals logged today</p>' : ''}
      ${dietToday.map(d => `
        <div class="diet-item">
          <div class="diet-meal">
            <span class="meal-type">${d.meal}</span>
            <span class="meal-food">${d.food}</span>
          </div>
          <div class="diet-mood">
            <span class="mood-stars">${'⭐'.repeat(d.mood)}</span>
            <button class="btn-icon" data-diet-id="${d.id}">✕</button>
          </div>
        </div>
      `).join('')}
    </div>

    <form class="form-diet" id="diet-form">
      <select id="meal-type" required>
        <option value="">Meal type...</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Snack">Snack</option>
        <option value="Dinner">Dinner</option>
      </select>
      <input type="text" id="food-input" placeholder="What did you eat?" required />
      <div class="mood-picker">
        <label>How did you feel?</label>
        <div class="stars" id="mood-stars">
          ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-mood="${i}">⭐</span>`).join('')}
        </div>
      </div>
      <button type="submit" class="btn">Add meal</button>
    </form>
  `;

  let selectedMood = 3;

  el.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      selectedMood = parseInt(star.dataset.mood);
      el.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      el.querySelectorAll('.star').forEach((s, i) => {
        if (i < selectedMood) s.classList.add('active');
      });
    });
  });

  el.querySelector('#diet-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const meal = el.querySelector('#meal-type').value;
    const food = el.querySelector('#food-input').value;
    onAdd(meal, food, selectedMood);
    el.querySelector('#diet-form').reset();
    selectedMood = 3;
  });

  el.querySelectorAll('.btn-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.dietId);
      onDelete(id);
    });
  });

  return el;
}
