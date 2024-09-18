import React, { useState, useEffect } from "react";

import Gallery from "../../components/project/gallery";
import { ProjectType } from "../../types/types";

interface WorkProps {
  projects: ProjectType[];
  tags: string[];
}

const Work = (props: WorkProps) => {
  const [projects, setProjects] = useState<ProjectType[]>(props.projects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/getSiteData');
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (!projects.length) {
      fetchProjects();
    }
  }, [projects]);

  return <Gallery projects={projects}></Gallery>;
};

export default Work;