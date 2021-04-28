{% extends '_layout.swig' %}
{% import '_macro/sidebar.swig' as sidebar_template with context %}

{# % block title % #}
  {# %- set page_title_suffix = ' | ' + title % #}

  {# %- if page.type === 'categories' and not page.title % #}
    {# {- __('title.category') + page_title_suffix } #}
  {# %- elif page.type === 'tags' and not page.title % #}
    {# {- __('title.tag') + page_title_suffix } #}
  {# %- elif page.type === 'schedule' and not page.title % #}
    {# {- __('title.schedule') + page_title_suffix } #}
  {# %- else % #}
    {# {- page.title + page_title_suffix } #}
  {# %- endif % #}
{# % endblock % #}

{% block class %}page posts-expand{% endblock %}

{% block content %}

    {##################}
    {### PAGE BLOCK ###}
    {##################}
    <div class="post-block" lang="{{ page.lang or config.language }}">
      {# % include '_partials/page/page-header.swig' % #}
      {#################}
      {### PAGE BODY ###}
      {#################}
      <div class="post-body{%- if page.direction and page.direction.toLowerCase() === 'rtl' %} rtl{%- endif %}">
        {%- if page.type === 'tags' %}
          <div class="tag-cloud">
            <div class="tag-cloud-title">
              {{ _p('counter.tag_cloud', site.tags.length) }}
            </div>
            <div class="tag-cloud-tags">
              {% if site.tags.length > 1 %}
              <script type="text/javascript" charset="utf-8" src="{{ url_for('/js/tagcloud.js') }}"></script>
              <script type="text/javascript" charset="utf-8" src="{{ url_for('/js/tagcanvas.js') }}"></script>
              <div class="widget-wrap">
                  <div id="myCanvasContainer" class="widget tagcloud">
                      <canvas width="800" height="800" id="resCanvas" style="width:100%">
                          {{ list_tags() }}
                      </canvas>
                  </div>
              </div>
              {% endif %}
            </div>
          </div>
        {% elif page.type === 'categories' %}
          <div class="category-all-page">
            <div class="category-all-title">
              {{ _p('counter.categories', site.categories.length) }}
            </div>
            <div class="category-all">
              {{ list_categories() }}
            </div>
          </div>
        {% elif page.type === 'schedule' %}
          <div class="event-list">
          </div>
          {% include '_scripts/pages/schedule.swig' %}
        {% else %}
          {{ page.content }}
        {%- endif %}
      </div>
      {#####################}
      {### END PAGE BODY ###}
      {#####################}
    </div>
    {% include '_partials/page/breadcrumb.swig' %}
    {######################}
    {### END PAGE BLOCK ###}
    {######################}

{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(true) }}
{% endblock %}
