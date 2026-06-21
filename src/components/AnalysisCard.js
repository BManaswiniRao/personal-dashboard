// ── AI Analysis Card ────────────────────────────────────────

export function AnalysisCard({ analysis, loading, onRequest }) {
  const el = document.createElement('div');
  el.className = 'card analysis-card';

  el.innerHTML = `
    <div class="card-header">
      <h2>✨ AI Analysis</h2>
      <button class="btn-small" id="request-analysis">${loading ? 'Analyzing...' : 'Get insights'}</button>
    </div>

    <div class="analysis-content">
      ${loading ? '<p class="loading">Generating insights...</p>' : ''}
      ${!loading && analysis ? `<p class="analysis-text">${analysis}</p>` : ''}
      ${!loading && !analysis ? '<p class="empty">Click "Get insights" to analyze your day</p>' : ''}
    </div>
  `;

  const btn = el.querySelector('#request-analysis');
  btn.addEventListener('click', onRequest);
  if (loading) btn.disabled = true;

  return el;
}
