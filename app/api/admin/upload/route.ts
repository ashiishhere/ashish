import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { dataUrl, folder } = await req.json();
    if (!dataUrl || !folder) {
      return NextResponse.json({ error: 'Missing dataUrl or folder' }, { status: 400 });
    }

    const result = await uploadImage(dataUrl, folder);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
