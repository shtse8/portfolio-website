import Reveal from "./Reveal";

/** Consistent editorial section intro: mono index + eyebrow, big title, lead. */
export default function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal className={align === "center" ? "section-label justify-center" : "section-label"}>
        <span className="text-accent">{index}</span>
        <span className="h-px w-6 bg-border" />
        {eyebrow}
      </Reveal>
      <Reveal as="div" delay={0.05}>
        <h2 className="text-h2 text-text-primary">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="lead mt-4">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
