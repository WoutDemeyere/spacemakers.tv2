import { useRouter } from "next/router";


import { SimpleGrid } from '@mantine/core';
import Thumbnail from '../thumbnail';
import type { ProjectType } from '../../../types/types';

type GalleryProps = {
  projects: ProjectType[];
  selectedTags: string[];
}

const Gallery = ({ projects, selectedTags }: GalleryProps) => {

  if (!projects || projects.length === 0) {
    return;
  }

  let filteredProjects = projects.filter((project) => {
    return selectedTags.every((tag) => project.tags.includes(tag));
  });

  const router = useRouter();

  const handleOpen = (project: ProjectType) => {
    router.push({
      pathname: `/work/${project.page_id}`,
      // query: { project: JSON.stringify(project) },
    });
  };

  //Sort projects by date
  filteredProjects = filteredProjects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const project_list = filteredProjects.map((project: ProjectType) => {
    if (project.thumbnail && project.id && project.title) {
      return <Thumbnail project={project} handleOpen={handleOpen} key={project.id} />
    }
    return null;
  }).filter(project => project !== null);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
      {project_list}
    </SimpleGrid>)
};

export default Gallery;