# Result entries

Add one JSON file to [`_data/results/`](../_data/results/) per model. Start the filename with the
publication date in `YYYY-MM-DD` form, for example `2026-10-26-azura-2-5-basic.json`. The filename
date controls newest-first ordering; the `name` field is what the site displays. A new file
automatically creates a model card on the [public results page](index.md). The page sorts entries
newest first using `published_at`.

Use this shape:

```json
{
  "name": "Model name",
  "provider": "Provider name",
  "published_at": "2026-10-26",
  "model_url": "https://example.com/model",
  "notes": "Optional context about this model entry.",
  "results": [
    {
      "benchmark": "ESAC-GI",
      "version": "v1.0.0",
      "score": 62.5,
      "max_score": 75,
      "runs": [61.0, 64.0],
      "gates": ["PASS", "PASS"],
      "verdict": "PASS",
      "pool": "held-out",
      "evaluated_at": "2026-10-25",
      "report_url": "https://example.com/report"
    }
  ]
}
```

Required fields are `name`, `published_at`, and `results`. Each result requires all fields shown
above. `verdict` must be `PASS`, `FAIL`, `INCOMPLETE`, or `NOT VALID`; `pool` must be `public` or
`held-out`; and `score` must be between zero and `max_score`. Keep the report link pointed at the
public artifact that supports the score. `runs` and `gates` are optional, for preserving repeated
run details behind an averaged score. Do not commit held-out seeds, answer keys, credentials, or
private evaluation material.
