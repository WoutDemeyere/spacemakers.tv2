import type { NextApiRequest, NextApiResponse } from 'next';
import { SPACE_TREE_API_BASE_URL } from '../../config/vars';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Triggering opacity request:', req.query.opacity);
  try {
    // Construct the URL with query parameters
    const url = new URL('/api/opacityTrigger', SPACE_TREE_API_BASE_URL);
    url.searchParams.set('opacity', req.query.opacity as string);
    
    console.log('Triggering opacity request:', url.toString());

    // Make the request to Azure Function
    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Azure Function returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.text();
    return res.status(200).json({ message: data });
    
  } catch (error: any) {
    console.error("Error triggering clip:", error);

    const errorStatus = error.message.includes('Invalid') ? 400 : 500;
    return res.status(errorStatus).json({
      status: errorStatus === 500 ? "Internal Server Error" : "Error",
      message: error.message,
    });
  }
}