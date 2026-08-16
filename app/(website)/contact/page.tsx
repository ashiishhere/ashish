import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ashish Dabhade for your next film, campaign or story.',
};

export default function ContactPage() {
  return (
    <section className="pt-40 pb-24 sm:pt-48 sm:pb-32">
      <div className="container-cinema">
        <p className="eyebrow mb-4">Get In Touch</p>
        <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl">
          Let&apos;s Create Something.
        </h1>
        <p className="mt-6 max-w-xl text-muted">
          Have a story, campaign or idea that needs to be brought to life? Let&apos;s talk.
        </p>

        <div className="mt-16 grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
