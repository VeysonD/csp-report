import { BigQuery } from '@google-cloud/bigquery';
import { Report } from './../types/report';

export const bigquery = new BigQuery();

export async function queryStackOverflow() {
  const sqlQuery = `
    SELECT
    CONCAT(
      'https://stackoverflow.com/questions/',
      CAST(id as STRING)) as url,
    view_count
    FROM \`bigquery-public-data.stackoverflow.posts_questions\`
    WHERE tags like '%google-bigquery%'
    ORDER BY view_count DESC
    LIMIT 10
  `;

  const options = {
    location: 'US',
  };

  const [rows]: any = await bigquery.query(sqlQuery, options);

  console.log('Query Results: ', rows);

  rows.forEach(row => {
    const url = row['url'];
    const viewCount = row['view_count'];
    console.log(`url: ${url}, ${viewCount} views`);
  });
}

export async function insertReport(report: Report) {
  const {
    'blocked-uri': blockedUri,
    disposition,
    'document-uri': documentUri,
    'effective-directive': effectiveDirective,
    'original-policy': originalPolicy,
    'status-code': statusCode,
    'script-sample': scriptSample,
    'violated-directive': violatedDirective,
  } = report;

  const referrer = report.referrer ? `'${report.referrer}'` : null;
  const sourceFile = report['source-file'] ? `'${report['source-file']}'` : null;
  const lineNumber = report['line-number'] === undefined ? null : report['line-number'];
  
  console.log(
    'Destructured items: ',
    blockedUri,
    disposition,
    documentUri,
    effectiveDirective,
    lineNumber,
    originalPolicy,
    referrer,
    scriptSample,
    sourceFile,
    statusCode,
    violatedDirective
  );

  const sqlQuery = `
    INSERT csp_report_data.csp_reports (
      blocked_uri,
      disposition,
      document_uri,
      effective_directive,
      line_number,
      original_policy,
      referrer,
      script_sample,
      source_file,
      status_code,
      violated_directive
    )
    VALUES (
      '${blockedUri}',
      '${disposition}',
      '${documentUri}',
      '${effectiveDirective}',
      ${lineNumber},
      "${originalPolicy}",
      ${referrer},
      '${scriptSample}',
      ${sourceFile},
      ${statusCode},
      '${violatedDirective}'
    )
  `;

  const options = {
    // location must match that of the dataset(s) referenced in query.
    location: 'asia-northeast1',  
  };

  console.log('Checking the final query: ', sqlQuery);

  const [queryResponse]: any = await bigquery.query(sqlQuery, options);

  console.log('What is the BigQuery response: ', queryResponse);
}

