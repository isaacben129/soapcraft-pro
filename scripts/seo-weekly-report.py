#!/usr/bin/env python3
"""seo-weekly-report.py — Aggregate SEO audit data and produce a weekly report.

Reads:
  - gtm/seo-weekly.csv (Search Console data)
  - gtm/health-weekly.md (content health)
  - gtm/community-weekly.md (community mentions)

Writes:
  - gtm/weekly-report.md (aggregated report)
"""

import csv
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "gtm"


def load_seo_data() -> list[dict]:
    csv_path = OUTPUT_DIR / "seo-weekly.csv"
    if not csv_path.exists():
        return []
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)


def load_text(path: Path) -> str:
    if path.exists():
        return path.read_text()
    return f"No data available (file not found: {path.name})"


def generate_report() -> str:
    seo_data = load_seo_data()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    lines = []
    lines.append("# SEO Weekly Report")
    lines.append(f"Generated: {now}")
    lines.append("")

    # ── Search Console Summary ──
    lines.append("## Search Console")
    if seo_data:
        total_impressions = sum(int(r.get("impressions", 0)) for r in seo_data)
        total_clicks = sum(int(r.get("clicks", 0)) for r in seo_data)
        avg_ctr = (
            f"{(total_clicks / total_impressions * 100):.2f}%"
            if total_impressions > 0
            else "N/A"
        )
        avg_position = (
            f"{(sum(float(r.get('position', 0)) for r in seo_data) / len(seo_data)):.1f}"
            if seo_data
            else "N/A"
        )

        lines.append(f"- Total impressions: {total_impressions}")
        lines.append(f"- Total clicks: {total_clicks}")
        lines.append(f"- Average CTR: {avg_ctr}")
        lines.append(f"- Average position: {avg_position}")
        lines.append("")

        # Top queries by impressions
        lines.append("### Top Queries by Impressions")
        sorted_data = sorted(
            seo_data, key=lambda r: int(r.get("impressions", 0)), reverse=True
        )
        for row in sorted_data[:10]:
            lines.append(
                f"- \"{row.get('query', 'unknown')}\" — {row.get('page', 'unknown')} "
                f"— {row.get('impressions', '0')} impressions, "
                f"{row.get('clicks', '0')} clicks, "
                f"{row.get('ctr', '0')}% CTR, "
                f"position {row.get('position', '0')}"
            )
        lines.append("")

        # Queries with high impressions but low CTR (opportunities)
        lines.append("### Improvement Opportunities")
        for row in sorted_data:
            impressions = int(row.get("impressions", 0))
            ctr = float(row.get("ctr", 0).replace("%", ""))
            if impressions >= 100 and ctr < 3.0:
                lines.append(
                    f"- \"{row.get('query', 'unknown')}\" — {impressions} impressions, "
                    f"{ctr}% CTR — consider optimizing title/description"
                )
        if not any(
            int(r.get("impressions", 0)) >= 100
            and float(r.get("ctr", "0").replace("%", "")) < 3.0
            for r in seo_data
        ):
            lines.append("- No high-impression, low-CTR opportunities this week")
        lines.append("")
    else:
        lines.append("- No Search Console data available this week")
        lines.append("- Ensure seo-audit.sh ran successfully")
        lines.append("")

    # ── Content Health ──
    lines.append("## Content Health")
    lines.append(load_text(OUTPUT_DIR / "health-weekly.md"))
    lines.append("")

    # ── Community Mentions ──
    lines.append("## Community Mentions")
    lines.append(load_text(OUTPUT_DIR / "community-weekly.md"))
    lines.append("")

    # ── Action Items ──
    lines.append("## Action Items")
    lines.append("- Review top queries and decide on new content priorities")
    lines.append("- Check for broken links or missing metadata")
    lines.append("- Review community mentions for engagement opportunities")
    lines.append("- Update intent registry if new pages were published")
    lines.append("")

    return "\n".join(lines)


def main() -> None:
    report = generate_report()
    output_path = OUTPUT_DIR / "weekly-report.md"
    output_path.write_text(report)
    print(f"[seo-weekly-report] Written: {output_path}")


if __name__ == "__main__":
    main()
