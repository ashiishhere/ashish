import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { db } from '@/lib/db';

export default async function NewProjectPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminHeader title="Add Project" />
      <div className="p-6 lg:p-10">
        <ProjectForm categories={categories} />
      </div>
    </>
  );
}
