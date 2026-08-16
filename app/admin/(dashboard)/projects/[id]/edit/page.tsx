import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { db } from '@/lib/db';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, categories] = await Promise.all([
    db.project.findUnique({ where: { id: params.id }, include: { videos: { orderBy: { sortOrder: 'asc' } } } }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!project) notFound();

  return (
    <>
      <AdminHeader title="Edit Project" />
      <div className="p-6 lg:p-10">
        <ProjectForm categories={categories} initialProject={project} />
      </div>
    </>
  );
}
