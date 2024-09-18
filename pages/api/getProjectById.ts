import axios from "axios";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract project ID from query parameters
  const endpoint = `https://storage.googleapis.com/spacemakers_site/_site_data`;

  try {
    const response = await axios.get(endpoint);
    const projects = response.data.data;
    const project = projects.find((project: any) => project.id === id);

    if (project) {
      return res.status(200).json(project);
    } else {
      return res.status(404).json({ status: "Error", message: "Project not found" });
    }
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