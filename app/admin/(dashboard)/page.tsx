import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db } from '@/lib/db';

async function getStats() {
  const [totalProjects, featuredProjects, longVideos, shortVideos, awards, unreadMessages] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { featured: true } }),
    db.projectVideo.count({ where: { videoType: 'LONG' } }),
    db.projectVideo.count({ where: { videoType: 'SHORT' } }),
    db.award.count(),
    db.contactMessage.count({ where: { status: 'NEW' } }),
  ]);
  return { totalProjects, featuredProjects, longVideos, shortVideos, awards, unreadMessages };
}

async function getRecentProjects() {
  return db.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { category: true } });
}

async function getRecentMessages() {
  return db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
}

export default async function AdminDashboardPage() {
  const [stats, recentProjects, recentMessages] = await Promise.all([
    getStats(),
    getRecentProjects(),
    getRecentMessages(),
  ]);

  const cards = [
    { label: 'Total Projects', value: stats.totalProjects },
    { label: 'Featured Projects', value: stats.featuredProjects },
    { label: 'Long Videos', value: stats.longVideos },
    { label: 'Short Videos', value: stats.shortVideos },
    { label: 'Awards', value: stats.awards },
    { label: 'Unread Messages', value: stats.unreadMessages },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((card) => (
            <div key={card.label} className="border border-border bg-surface p-5">
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest2 text-muted">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className="border border-accent bg-accent px-5 py-2.5 text-xs uppercase tracking-widest2 text-white">
            Add Project
          </Link>
          <Link href="/admin/awards/new" className="border border-border px-5 py-2.5 text-xs uppercase tracking-widest2 hover:border-accent hover:text-accent">
            Add Award
          </Link>
          <Link href="/admin/experience" className="border border-border px-5 py-2.5 text-xs uppercase tracking-widest2 hover:border-accent hover:text-accent">
            Add Experience
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-sm uppercase tracking-widest2 text-muted">Recent Projects</h2>
            {recentProjects.length > 0 ? (
              <div className="divide-y divide-border border-t border-b border-border">
                {recentProjects.map((p) => (
                  <Link key={p.id} href={`/admin/projects/${p.id}/edit`} className="flex items-center justify-between py-3 text-sm hover:text-accent">
                    <span>{p.title}</span>
                    <span className="text-xs text-muted">{p.category?.name ?? 'Uncategorized'}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No projects yet.</p>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-sm uppercase tracking-widest2 text-muted">Recent Messages</h2>
            {recentMessages.length > 0 ? (
              <div className="divide-y divide-border border-t border-b border-border">
                {recentMessages.map((m) => (
                  <Link key={m.id} href="/admin/messages" className="flex items-center justify-between py-3 text-sm hover:text-accent">
                    <span>{m.name}</span>
                    <span className="text-xs text-muted">{m.status}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No messages yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
