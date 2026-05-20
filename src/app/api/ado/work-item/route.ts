import { NextRequest, NextResponse } from 'next/server';
import { fetchWorkItemsBatch, fetchWorkItemComments } from '@/lib/ado';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pat, itemId } = body;
    if (!pat) return NextResponse.json({ error: 'PAT is required' }, { status: 401 });
    if (!itemId) return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    const org = process.env.ADO_ORG;
    const project = process.env.ADO_PROJECT;
    if (!org || !project) return NextResponse.json({ error: 'ADO_ORG and ADO_PROJECT must be configured' }, { status: 500 });
    const [workItems, comments] = await Promise.all([
      fetchWorkItemsBatch(org, project, [itemId], pat),
      fetchWorkItemComments(org, project, itemId, pat),
    ]);
    if (workItems.length === 0) return NextResponse.json({ error: 'Work item not found' }, { status: 404 });
    return NextResponse.json({ workItem: { ...workItems[0], comments } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
