import PocketBase from 'pocketbase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '../../config/vars';

const baseUrl = API_BASE_URL;
const pb = new PocketBase(baseUrl);

pb.autoCancellation(false);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const projects = await pb.collection('projects').getFullList({
      sort: '-created',
    });

    if (!projects) {
      return res.status(404).json({
        status: "Error",
        message: "No projects found",
      });
    }
    
    const filteredProjects = projects.filter((project: any) => project.show !== false);
    return res.status(200).json(filteredProjects);
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