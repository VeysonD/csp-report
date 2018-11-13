import { BigQuery } from '@google-cloud/bigquery';

export const bigquery = new BigQuery();

// interface Row {
//   url: string,
//   view_count: string,
// }

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
    query: sqlQuery,
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

