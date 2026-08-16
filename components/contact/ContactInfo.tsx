export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Email</p>
        <a href="mailto:ashishdabhade07@gmail.com" className="text-lg hover:text-accent">
          ashishdabhade07@gmail.com
        </a>
      </div>
      <div>
        <p className="eyebrow mb-2">Phone</p>
        <a href="tel:+918959337707" className="text-lg hover:text-accent">+91 89593 37707</a>
      </div>
      <div>
        <p className="eyebrow mb-2">Elsewhere</p>
        <div className="flex flex-col gap-1">
          <a href="https://linkedin.com/in/ashish-dabhade" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-accent">
            LinkedIn
          </a>
          <a href="https://linktr.ee/ashishdab" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-accent">
            Linktree
          </a>
        </div>
      </div>
    </div>
  );
}
