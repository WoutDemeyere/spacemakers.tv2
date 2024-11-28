import type { NextApiRequest, NextApiResponse } from 'next';
import { SPACE_TREE_API_BASE_URL } from '../../config/vars';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Construct the URL with query parameters
    const url = new URL('/api/columnSelect', SPACE_TREE_API_BASE_URL);
    url.searchParams.set('columnIndex', req.query.columnIndex as string);
    url.searchParams.set('columnTriggerType', "connect");

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