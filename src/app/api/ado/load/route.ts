import { NextRequest, NextResponse } from 'next/server';
import { fetchQueryResults, fetchWorkItemsBatch } from '@/lib/ado';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pat, queryEnvVar } = body;

    if (!pat) {
      return NextResponse.json({ error: 'PAT is required' }, { status: 401 });
    }

    if (!queryEnvVar) {
      return NextResponse.json({ error: 'queryEnvVar is required' }, { status: 400 });
    }

    const org = process.env.ADO_ORG;
    const project = process.env.ADO_PROJECT;
    const queryId = process.env[queryEnvVar];

    if (!org || !project) {
      return NextResponse.json({ error: 'ADO_ORG and ADO_PROJECT must be configured' }, { status: 500 });
    }

    if (!queryId) {
      return NextResponse.json({ error: `Environment variable ${queryEnvVar} is not configured` }, { status: 500 });
    }

    const { ids, error: queryError } = await fetchQueryResults(org, project, queryId, pat);
    
    if (queryError) {
      return NextResponse.json({ error: queryError }, { status: 400 });
    }

    const workItems = await fetchWorkItemsBatch(org, project, ids, pat);

    return NextResponse.json({
      workItems,
      queryId,
      total: workItems.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
