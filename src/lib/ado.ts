import { WorkItem, WorkItemComment } from '@/types';

const ADO_API_VERSION = '7.1';

export function getAdoBaseUrl(org: string, project: string) {
  return `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}`;
}

export function makeAuthHeader(pat: string) {
  const token = Buffer.from(`:${pat}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

export async function fetchQueryResults(
  org: string,
  project: string,
  queryId: string,
  pat: string
): Promise<{ ids: number[]; error?: string }> {
  const url = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/wiql/${queryId}?api-version=${ADO_API_VERSION}`;
  
  const res = await fetch(url, {
    headers: { ...makeAuthHeader(pat), 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text();
    return { ids: [], error: `Query failed (${res.status}): ${text.slice(0, 200)}` };
  }

  const data = await res.json();
  const ids: number[] = (data.workItems || []).map((wi: { id: number }) => wi.id);
  return { ids };
}

export async function fetchWorkItemsBatch(
  org: string,
  project: string,
  ids: number[],
  pat: string
): Promise<WorkItem[]> {
  if (ids.length === 0) return [];

  const fields = [
    'System.Id',
    'System.Title',
    'System.State',
    'System.Tags',
    'System.AssignedTo',
    'System.IterationPath',
    'System.AreaPath',
    'System.WorkItemType',
    'System.CreatedDate',
    'System.ChangedDate',
    'Microsoft.VSTS.Common.Severity',
    'Microsoft.VSTS.Common.Priority',
    'Custom.PI_ReleaseDate',
    'System.Description',
    'Microsoft.VSTS.TCM.ReproSteps',
    'Microsoft.VSTS.Common.AcceptanceCriteria',
  ];

  const results: WorkItem[] = [];
  const batchSize = 200;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const url = `https://dev.azure.com/${encodeURIComponent(org)}/_apis/wit/workitemsbatch?api-version=${ADO_API_VERSION}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { ...makeAuthHeader(pat), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: batch, fields }),
    });

    if (!res.ok) continue;

    const data = await res.json();
    for (const item of data.value || []) {
      const f = item.fields;
      results.push({
        id: f['System.Id'],
        title: f['System.Title'] || '',
        state: f['System.State'] || '',
        severity: f['Microsoft.VSTS.Common.Severity'] || '',
        priority: String(f['Microsoft.VSTS.Common.Priority'] || ''),
        assignedTo: typeof f['System.AssignedTo'] === 'object'
          ? f['System.AssignedTo']?.displayName || ''
          : f['System.AssignedTo'] || '',
        tags: f['System.Tags'] || '',
        iterationPath: f['System.IterationPath'] || '',
        areaPath: f['System.AreaPath'] || '',
        workItemType: f['System.WorkItemType'] || '',
        createdDate: f['System.CreatedDate'] || '',
        changedDate: f['System.ChangedDate'] || '',
        piReleaseDate: f['Custom.PI_ReleaseDate'] || '',
        description: f['System.Description'] || '',
        reproSteps: f['Microsoft.VSTS.TCM.ReproSteps'] || '',
        acceptanceCriteria: f['Microsoft.VSTS.Common.AcceptanceCriteria'] || '',
      });
    }
  }

  return results;
}

export async function fetchWorkItemComments(
  org: string,
  project: string,
  itemId: number,
  pat: string
): Promise<WorkItemComment[]> {
  const url = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/workItems/${itemId}/comments?api-version=7.1-preview.3`;

  const res = await fetch(url, {
    headers: { ...makeAuthHeader(pat), 'Content-Type': 'application/json' },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.comments || []).map((c: {
    id: number;
    text?: string;
    renderedText?: string;
    createdBy?: { displayName?: string };
    createdDate?: string;
  }) => ({
    id: c.id,
    text: c.text || c.renderedText || '',
    createdBy: c.createdBy?.displayName || '',
    createdDate: c.createdDate || '',
  }));
}

export function getQueryUrl(org: string, project: string, queryId: string): string {
  return `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_queries/query/${queryId}/`;
}

export function getWorkItemUrl(org: string, project: string, itemId: number): string {
  return `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_workitems/edit/${itemId}`;
}
