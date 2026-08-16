import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProjectsTable } from '@/components/admin/ProjectsTable';
import { db } from '@/lib/db';

async function getProjects() {
  return db.project.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <AdminHeader title="Projects" />
      <div className="p-6 lg:p-10">
        <div className="mb-6 flex justify-end">
          <Link href="/admin/projects/new" className="border border-accent bg-accent px-5 py-2.5 text-xs uppercase tracking-widest2 text-white">
            Add Project
          </Link>
        </div>

        <ProjectsTable projects={projects} />
      </div>
    </>
  );
}
