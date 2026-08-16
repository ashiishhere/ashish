export function ProjectDescription({ description }: { description: string | null }) {
  if (!description) return null;
  return (
    <div className="container-cinema py-16">
      <div className="max-w-3xl space-y-4 text-muted">
        {description.split('\n').filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}
