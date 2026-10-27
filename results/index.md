# Public results

<p class="results-intro">Published ESAC results, grouped by model. Each model's entry includes the benchmark version and conditions needed to interpret its score.</p>

{% assign result_files = site.data.results %}
{% if result_files.size == 0 %}
<p class="empty-state">No public results have been published yet. Results will appear here when a model entry is added to <code>_data/results/</code>.</p>
{% else %}
{% assign result_count = 0 %}
{% assign pass_count = 0 %}
{% assign total_percentage = 0 %}
{% for result_file in result_files %}
  {% assign result = result_file[1] %}
  {% for benchmark in result.results %}
    {% assign result_count = result_count | plus: 1 %}
    {% assign percentage = benchmark.score | times: 100 | divided_by: benchmark.max_score %}
    {% assign total_percentage = total_percentage | plus: percentage %}
    {% if benchmark.verdict == "PASS" %}{% assign pass_count = pass_count | plus: 1 %}{% endif %}
  {% endfor %}
{% endfor %}
{% assign average_percentage = total_percentage | divided_by: result_count | round: 1 %}
{% assign pass_rate = pass_count | times: 100 | divided_by: result_count | round: 1 %}
{% assign latest_result_file = result_files | first %}
{% assign latest_published_at = latest_result_file[1].published_at %}

<p class="results-updated">Latest publication: <time datetime="{{ latest_published_at }}">{{ latest_published_at }}</time> · Newest entries appear first.</p>

<section class="results-stats" aria-labelledby="statistics-heading">
  <h2 id="statistics-heading">Statistics</h2>
  <div class="stat-grid">
    <div class="stat-card"><strong>{{ result_files.size }}</strong><span>Models</span></div>
    <div class="stat-card"><strong>{{ result_count }}</strong><span>Benchmark results</span></div>
    <div class="stat-card"><strong>{{ average_percentage }}%</strong><span>Average score</span></div>
    <div class="stat-card"><strong>{{ pass_rate }}%</strong><span>Passing results</span></div>
  </div>

  <div class="table-scroll">
    <table class="benchmark-stats">
      <caption>Aggregates by benchmark</caption>
      <thead>
        <tr data-published="{{ result.published_at }}">
          <th scope="col">Benchmark</th>
          <th scope="col">Average</th>
          <th scope="col">Pass rate</th>
          <th scope="col">Highest score</th>
        </tr>
      </thead>
      <tbody>
        {% assign benchmark_names = "ESAC-GI|ESAC-AG" | split: "|" %}
        {% for benchmark_name in benchmark_names %}
        {% assign benchmark_count = 0 %}
        {% assign benchmark_passes = 0 %}
        {% assign benchmark_total_percentage = 0 %}
        {% assign best_score = -1 %}
        {% assign best_model = "" %}
        {% for result_file in result_files %}
          {% assign result = result_file[1] %}
          {% for benchmark in result.results %}
            {% if benchmark.benchmark == benchmark_name %}
              {% assign benchmark_count = benchmark_count | plus: 1 %}
              {% assign benchmark_percentage = benchmark.score | times: 100 | divided_by: benchmark.max_score %}
              {% assign benchmark_total_percentage = benchmark_total_percentage | plus: benchmark_percentage %}
              {% if benchmark.verdict == "PASS" %}{% assign benchmark_passes = benchmark_passes | plus: 1 %}{% endif %}
              {% if benchmark.score > best_score %}
                {% assign best_score = benchmark.score %}
                {% assign best_model = result.name %}
              {% endif %}
            {% endif %}
          {% endfor %}
        {% endfor %}
        <tr>
          <th scope="row">{{ benchmark_name }}</th>
          {% if benchmark_count > 0 %}
          {% assign benchmark_average = benchmark_total_percentage | divided_by: benchmark_count | round: 1 %}
          {% assign benchmark_pass_rate = benchmark_passes | times: 100 | divided_by: benchmark_count | round: 1 %}
          <td>
            {{ benchmark_average }}%
            <div class="score-bar" role="img" aria-label="{{ benchmark_average }} percent average score"><span style="width: {{ benchmark_average }}%"></span></div>
          </td>
          <td>{{ benchmark_pass_rate }}% <small>({{ benchmark_passes }}/{{ benchmark_count }})</small></td>
          <td>{{ best_score }} / 75 <small>{{ best_model | escape }}</small></td>
          {% else %}
          <td colspan="3" class="not-reported">No results reported</td>
          {% endif %}
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</section>

<section class="results-overview" aria-labelledby="overview-heading">
  <h2 id="overview-heading">At a glance</h2>
  <div class="table-scroll">
    <table class="results-summary">
      <caption>Average score and final gate for each published model result</caption>
      <thead>
        <tr>
          <th scope="col">Model</th>
          <th scope="col">ESAC-GI<br><small>/ 75</small></th>
          <th scope="col">ESAC-AG<br><small>/ 75</small></th>
        </tr>
      </thead>
      <tbody>
        {% for result_file in result_files %}
        {% assign result = result_file[1] %}
        {% assign gi = result.results | where: "benchmark", "ESAC-GI" | first %}
        {% assign ag = result.results | where: "benchmark", "ESAC-AG" | first %}
        <tr>
          <th scope="row"><a href="#{{ result.slug | default: result_file[0] | slugify }}">{{ result.name | escape }}</a></th>
          <td>
            {% if gi %}<strong>{{ gi.score }}</strong><span class="score-denominator"> / 75</span><br><span class="verdict verdict-{{ gi.verdict | downcase | replace: " ", "-" }}">{{ gi.verdict | escape }}</span>{% else %}<span class="not-reported">—</span>{% endif %}
          </td>
          <td>
            {% if ag %}<strong>{{ ag.score }}</strong><span class="score-denominator"> / 75</span><br><span class="verdict verdict-{{ ag.verdict | downcase | replace: " ", "-" }}">{{ ag.verdict | escape }}</span>{% else %}<span class="not-reported">—</span>{% endif %}
          </td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</section>

<section class="results-details" aria-labelledby="details-heading">
  <h2 id="details-heading">Details by model</h2>
{% for result_file in result_files %}
{% assign result = result_file[1] %}
<article class="result-card" id="{{ result.slug | default: result_file[0] | slugify }}" data-published="{{ result.published_at }}">
  <h2>{{ result.name | escape }}</h2>
  <p class="result-meta">
    {% if result.provider %}{{ result.provider | escape }} · {% endif %}
    Published {{ result.published_at | escape }}
    {% if result.model_url %} · <a href="{{ result.model_url | escape }}">Model</a>{% endif %}
  </p>

  {% if result.notes %}<p>{{ result.notes | escape }}</p>{% endif %}

  <div class="table-scroll">
  <table class="result-detail-table">
    <thead>
      <tr>
        <th>Benchmark</th>
        <th>Average score</th>
        <th>Verdict</th>
        <th>Pool</th>
        <th>Evaluated</th>
        <th>Report</th>
      </tr>
    </thead>
    <tbody>
      {% for benchmark in result.results %}
      {% assign percentage = benchmark.score | times: 100 | divided_by: benchmark.max_score | round: 1 %}
      <tr>
        <td>{{ benchmark.benchmark | escape }} {{ benchmark.version | escape }}</td>
        <td class="score-cell">
          <strong>{{ benchmark.score }} / {{ benchmark.max_score }}</strong>
          <span class="percentage">{{ percentage }}%</span>
          {% if benchmark.runs %}<br><small>Runs: {{ benchmark.runs | join: " / " }}{% if benchmark.gates %} · Gates: {{ benchmark.gates | join: " / " }}{% endif %}</small>{% endif %}
        </td>
        <td><span class="verdict verdict-{{ benchmark.verdict | downcase | replace: " ", "-" }}">{{ benchmark.verdict | escape }}</span></td>
        <td>{{ benchmark.pool | escape }}</td>
        <td>{{ benchmark.evaluated_at | escape }}</td>
        <td><a href="{{ benchmark.report_url | escape }}">Source</a></td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  </div>
</article>
{% endfor %}
</section>
{% endif %}

## Add a result

To publish a model, add one JSON file to [`_data/results/`](https://github.com/EcoWestern/ESAC/tree/main/_data/results) using the documented [result format](README.md), then open a pull request. The site build checks the entry before it can be published.

<script>
  // Jekyll exposes the per-file data directory as a hash, so sort rendered entries in the
  // browser by the date that the validator already requires in each JSON entry.
  (() => {
    const newestFirst = (a, b) => b.dataset.published.localeCompare(a.dataset.published);
    const summary = document.querySelector('.results-summary tbody');
    const details = document.querySelector('.results-details');
    if (summary) [...summary.querySelectorAll('tr')].sort(newestFirst).forEach((row) => summary.append(row));
    if (details) [...details.querySelectorAll('.result-card')].sort(newestFirst).forEach((card) => details.append(card));
  })();
</script>
