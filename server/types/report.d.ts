export interface Report {
  'blocked-uri': string,
  'disposition': string,
  'document-uri': string,
  'effective-directive': string,
  'line-number'?: number,
  'original-policy': string,
  'referrer'?: string,
  'script-sample'?: string,
  'source-file': string,
  'status-code': number,
  'violated-directive': string,
}

export interface Row {
  url: string,
  view_count: string,
}