// search-status.js
// Polls Redis for search job status

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  const data = await response.json();
  return data.result ? JSON.parse(data.result) : null;
}

export const handler = async (event) => {
  const jobId = event.queryStringParameters?.jobId;
  
  if (!jobId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing jobId parameter' })
    };
  }

  try {
    const jobData = await redisGet(jobId);
    
    if (!jobData) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'pending' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    };
  } catch (error) {
    console.error('Status check error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to check status' })
    };
  }
};
