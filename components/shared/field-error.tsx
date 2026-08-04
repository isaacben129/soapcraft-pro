// ── FieldError / BlockingErrorSummary ────────

interface FieldErrorProps {
  message: string;
  field?: string;
}

export function FieldError({ message, field }: FieldErrorProps) {
  return (
    <p
      className="text-sm text-destructive flex items-start gap-1"
      role="alert"
    >
      <span className="flex-shrink-0">⚠</span>
      <span>
        {field && <span className="font-medium">{field}: </span>}
        {message}
      </span>
    </p>
  );
}

interface BlockingErrorSummaryProps {
  errors: Array<{ field?: string; message: string }>;
}

export function BlockingErrorSummary({ errors }: BlockingErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div
      className="border border-destructive/30 bg-destructive/5 rounded-lg p-4"
      role="alert"
    >
      <h4 className="text-sm font-medium text-destructive mb-2">
        Blocking errors — save is prevented
      </h4>
      <ul className="space-y-1">
        {errors.map((error, i) => (
          <li key={i} className="text-sm text-destructive flex items-start gap-1">
            <span>•</span>
            <span>
              {error.field && <span className="font-medium">{error.field}: </span>}
              {error.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
