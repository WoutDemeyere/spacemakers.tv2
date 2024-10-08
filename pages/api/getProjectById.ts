import PocketBase from 'pocketbase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '../../config/vars';
// const pb = new PocketBase('http://127.0.0.1:8090');

const baseUrl = API_BASE_URL;
const pb = new PocketBase(baseUrl);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract project ID from query parameters

  const record = await pb.collection('projects').getFirstListItem(`page_id=${id}`, {});

  try {

    if(!record) {
      return res.status(404).json({ status: "Error", message: "Project not found" });
    }

    return res.status(200).json(record);
  } catch (error: any) {
    console.error("Error fetching report data:", error);

    const errorStatus = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    return res.status(errorStatus).json({
      status: errorStatus === 500 ? "Internal Server Error " : "Error",
      message: errorMessage,
    });
  }
}