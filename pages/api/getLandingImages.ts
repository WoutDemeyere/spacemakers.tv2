import PocketBase from 'pocketbase';
import type { NextApiRequest, NextApiResponse } from 'next';

const pb = new PocketBase('http://127.0.0.1:8090');

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const images = await pb.collection('Landing_page_images').getFullList({
      sort: '+ORDER',
    });
    const filteredImages = images.filter((image: any) => image.show !== false);
    return res.status(200).json(filteredImages);
  } catch (error: any) {
    console.error("Error fetching report data:", error);

    const errorStatus = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    return res.status(errorStatus).json({
      status: errorStatus === 500 ? "Internal Server Error" : "Error",
      message: errorMessage,
    });
  }
}