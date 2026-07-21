{%- if page.path === 'graph/index.html' %}
  <script src="{{ url_for('lib/d3.min.js') }}"></script>
  <script src="{{ url_for('js/knowledge-graph-model.js') }}"></script>
  <script src="{{ url_for('js/knowledge-graph.js') }}?v=kg-phase-1"></script>
{%- endif %}
