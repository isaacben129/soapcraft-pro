export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const BANNED_PHRASES = ["map pin", "I run Web Align", "Googling"];

export function validateContent(
  content: string,
  frontmatter: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!frontmatter.contentMode) {
    errors.push("Missing contentMode in frontmatter");
  }
  if (!frontmatter.intentStage) {
    errors.push("Missing intentStage in frontmatter");
  }
  if (!frontmatter.contentFamily) {
    errors.push("Missing contentFamily in frontmatter");
  }
  if (!frontmatter.reviewStatus) {
    errors.push("Missing reviewStatus in frontmatter");
  }

  for (const phrase of BANNED_PHRASES) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      errors.push(`Contains banned phrase: "${phrase}"`);
    }
  }

  if (content.includes("\u2014")) {
    warnings.push(
      "Contains em dash \u2014 use a period, comma, colon, or restructured clause instead"
    );
  }

  const wordCount = content.split(/\s+/).length;
  if (wordCount < 800) {
    warnings.push(
      `Content is ${wordCount} words \u2014 minimum 800 recommended`
    );
  }

  const hasProductBridge =
    content.toLowerCase().includes("soapcraft pro") ||
    content.toLowerCase().includes("try soapcraft pro") ||
    content.toLowerCase().includes("start your pro trial");
  if (!hasProductBridge) {
    warnings.push(
      "No product bridge found \u2014 page should reference SoapCraft Pro"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
