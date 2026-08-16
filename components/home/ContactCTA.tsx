import { Button } from '@/components/ui/Button';

interface ContactCTAProps {
  heading?: string | null;
  text?: string | null;
}

const DEFAULT_HEADING = "Let's Create Something.";
const DEFAULT_TEXT = 'Have a story, campaign or idea that needs to be brought to life? Let\'s talk.';

export function ContactCTA({ heading, text }: ContactCTAProps) {
  return (
    <section className="border-t border-border bg-background py-28 sm:py-40">
      <div className="container-cinema text-center">
        <h2 className="font-display text-4xl uppercase leading-tight sm:text-5xl lg:text-6xl">
          {heading || DEFAULT_HEADING}
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-muted">
          {text || DEFAULT_TEXT}
        </p>
        <Button href="/contact" size="lg" className="mt-10">Start a Conversation</Button>
      </div>
    </section>
  );
}
