# SoapCraft Pro Chemistry Review Packet

## Purpose

Review the current provisional SAP dataset and deterministic chemistry contract before any public chemistry release. Do not approve by intuition. Verify each value against authoritative sources, document disagreements, and return a signed review with exact replacement values or ranges.

## Current status

- The current oil values are explicitly `estimated` and `reviewerState: pending`.
- They are legacy provisional values and must not be treated as independently verified public data.
- Synthetic fixture `test-oil-a` is not a real ingredient and exists only to test algebra.
- Public chemistry must remain fail-closed until the dataset is reviewed.

## Current provisional dataset

Values are KOH-basis SAP in grams KOH per gram oil. NaOH is derived as:

`SAP_NaOH = SAP_KOH × 39.997 / 56.106`

| ID | Ingredient | Provisional SAP KOH | Current source/status |
|---|---|---:|---|
| olive-oil | Olive Oil | 0.1920 | Legacy SoapCalc value, estimated |
| coconut-oil | Coconut Oil | 0.2730 | Legacy SoapCalc value, estimated |
| palm-oil | Palm Oil | 0.2020 | Legacy SoapCalc value, estimated |
| shea-butter | Shea Butter | 0.1830 | Legacy SoapCalc value, estimated |
| castor-oil | Castor Oil | 0.1810 | Legacy SoapCalc value, estimated |
| sweet-almond-oil | Sweet Almond Oil | 0.1960 | Legacy SoapCalc value, estimated |
| avocado-oil | Avocado Oil | 0.1910 | Legacy SoapCalc value, estimated |
| sunflower-oil | Sunflower Oil | 0.1940 | Legacy SoapCalc value, estimated |
| rice-bran-oil | Rice Bran Oil | 0.1920 | Legacy SoapCalc value, estimated |
| canola-oil | Canola Oil | 0.1930 | Legacy SoapCalc value, estimated |

Synthetic algebra fixture:

| ID | SAP KOH | SAP NaOH | Purpose |
|---|---:|---:|---|
| test-oil-a | 0.190000 | 0.1354477239510926 | Formula/algebra test only, never public |

## Formula contract to review

### NaOH-only

```text
lyeNaOH_raw = sum(oilWeight[i] × SAP_NaOH[i])
lyeNaOH = lyeNaOH_raw × (1 - superfatPercent / 100)
```

### KOH-only

```text
lyeKOH_raw = sum(oilWeight[i] × SAP_KOH[i])
lyeKOH_pure = lyeKOH_raw × (1 - superfatPercent / 100)
lyeKOH_as_supplied = lyeKOH_pure / KOH_purity_fraction
```

### Mixed alkali

The KOH percentage is a share of full pure alkali equivalents, not a mass percentage.

```text
kohFraction = kohSharePercent / 100
naohFraction = 1 - kohFraction
discount = 1 - superfatPercent / 100

fullNaOHPure = sum(oilWeight[i] × SAP_NaOH[i])
fullKOHPure = sum(oilWeight[i] × SAP_KOH[i])

lyeNaOH_pure = fullNaOHPure × naohFraction × discount
lyeKOH_pure = fullKOHPure × kohFraction × discount

lyeNaOH_as_supplied = lyeNaOH_pure / NaOH_purity_fraction
lyeKOH_as_supplied = lyeKOH_pure / KOH_purity_fraction
```

### Water modes

Exactly one mode is active:

```text
water_to_lye_ratio:
water = totalAlkaliAsSupplied × waterToLyeRatio

lye_concentration:
water = totalAlkaliAsSupplied × ((1 / concentrationFraction) - 1)

percent_of_oils:
water = oilWeightTotal × waterPercent / 100
```

### Other safety boundaries

- Superfat/lye discount is applied once at recipe level.
- Purity correction is applied independently to each alkali.
- No universal mold-density constant is allowed.
- Calibrated mold mode uses the maker's own measured density.
- Planning mode must return an explicitly approximate range.
- No arbitrary hardness, lather, moisturizing, or skin-performance claims.
- Fragrance/IFRA output must not claim compliance without product identity, category, current source data, and verified calculation.

## Review tasks for the specialist AI

1. Find authoritative sources for the SAP KOH values for all 10 real ingredients.
2. Prefer primary or technically authoritative sources. Record source title, URL/identifier, publication/revision date, retrieval date, method, and any stated uncertainty/range.
3. Compare the provisional value to each source. Do not average disagreements.
4. Explain whether a single canonical value is justified. If not, recommend a range, oil subtype, or explicit user-selection distinction.
5. Verify the NaOH conversion factor and molecular-weight assumptions.
6. Verify whether the mixed-alkali semantics are chemically coherent and clearly labeled.
7. Verify whether superfat/lye-discount treatment is correct for NaOH, KOH, and mixed alkali.
8. Verify the three water-mode equations and identify any hidden unit or purity issue.
9. Identify any calculation or wording that could create a safety-critical misunderstanding.
10. Produce independent golden fixtures using hand calculation or an independently implemented calculation. Do not reuse the application code as the only calculator.
11. State which ingredients may be approved for public use and which must remain blocked.
12. Return a named review decision: `APPROVE`, `APPROVE WITH CHANGES`, or `REJECT`.

## Required output from the specialist AI

For every real ingredient:

```text
ingredient_id:
recommended_display_name:
recommended_sap_koh:
recommended_sap_naoh:
acceptable_range_or_uncertainty:
source_title:
source_url_or_identifier:
source_method:
publication_or_revision_date:
retrieval_date:
source_quality_grade:
comparison_to_provisional_value:
public_use_decision:
reason:
```

Also return:

```text
overall_decision:
named_reviewer_or_model:
review_date:
formula_findings:
required_code_changes:
independent_fixtures:
open_questions:
```

## Important review discipline

- Do not treat SoapCalc, SoapmakingToolbox, SoapmakingFriend, or another calculator as automatically authoritative merely because it produces a number.
- Use competitor calculators as parity/reference evidence, not as the only source of truth.
- Do not invent provenance, dates, or precision.
- If a source cannot be accessed, mark it unavailable.
- If sources disagree, preserve the disagreement and recommend a resolution.
- Do not approve a value simply because it is common in soapmaking spreadsheets.
- Do not return a generic explanation. Return a row-by-row dataset decision and independent numerical fixtures.
