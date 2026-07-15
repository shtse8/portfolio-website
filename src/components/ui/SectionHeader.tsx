import Reveal from "./Reveal";

/** Cinematic section intro: mono act index, display title, lead. */
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
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }
    >
      <Reveal
        className={
          align === "center" ? "section-label justify-center" : "section-label"
        }
      >
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-gradient-to-r from-accent/60 to-transparent" />
        {eyebrow}
      </Reveal>
      <Reveal as="div" delay={0.08}>
        <h2 className="text-h2 text-text-primary">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="lead mt-5 max-w-2xl">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
