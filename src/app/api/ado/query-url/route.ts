import { NextRequest, NextResponse } from 'next/server';
import { getQueryUrl } from '@/lib/ado';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryEnvVar = searchParams.get('queryEnvVar');

  if (!queryEnvVar) {
    return NextResponse.json({ error: 'queryEnvVar is required' }, { status: 400 });
  }

  const org = process.env.ADO_ORG;
  const project = process.env.ADO_PROJECT;
  const queryId = process.env[queryEnvVar];

  if (!org || !project || !queryId) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  return NextResponse.json({ url: getQueryUrl(org, project, queryId) });
}
