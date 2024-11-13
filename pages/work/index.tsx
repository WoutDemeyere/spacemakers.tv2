import React, { useState, useEffect, useRef } from "react";
import Gallery from "../../components/project/gallery";
import GalleryFilter from "../../components/GalleryFilter";
import type { ProjectType } from '../../types/types';
import { LoadingOverlay } from "@mantine/core";
import { API_BASE_URL } from '../../config/vars';

const baseUrl = API_BASE_URL;

interface WorkProps {
  projects: ProjectType[];
  tags: string[];
}

const Work = (props: WorkProps) => {
  const [projects, setProjects] = useState<ProjectType[]>(props.projects);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(props.tags || []);
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetchedData = useRef(false); // Ref to track if data has been fetched

  const handleTagChange = (_tags: string[]) => {
    setSelectedTags(_tags);
  };

  useEffect(() => {
    if (hasFetchedData.current) return; // Skip if already fetched

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getSiteData");
        if (!response.ok) return;

        const data = await response.json();

        const updatedProjects = data.map((project: ProjectType) => {
          project.thumbnail = `${baseUrl}/api/files/${project.collectionId}/${project.id}/${project.thumbnail}`;
          project.images = project.images?.map(
            (image: string) => `${baseUrl}/api/files/${project.collectionId}/${project.id}/${image}`
          );
          project.videos = project.videos?.map(
            (video: string) => `${baseUrl}/api/files/${project.collectionId}/${project.id}/${video}`
          );
          return project;
        });

        const tempTags: string[] = [];
        updatedProjects.forEach((project: ProjectType) => {
          project.tags.forEach((tag: string) => {
            if (!tempTags.includes(tag)) {
              tempTags.push(tag);
            }
          });
        });

        setTags(tempTags);
        setProjects(updatedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    hasFetchedData.current = true; // Mark data as fetched
  }, []); // Empty dependency array ensures this runs only once

  return (
    <React.Fragment>
      {loading ? (
        <LoadingOverlay
          visible
          zIndex={1000}
          overlayProps={{ radius: "lg" }}
          loaderProps={{ color: "rgba(0, 0, 0, 1)", size: "lg", type: "dots" }}
        />
      ) : (
        <>
          <h1 style={{ position: "absolute", left: "-9999px" }}>
            Spacemakers Work Portfolio
          </h1>
          <GalleryFilter tags={tags} handleTagsChange={handleTagChange} />
          <Gallery projects={projects} selectedTags={selectedTags} />
        </>
      )}
    </React.Fragment>
  );
};

export default Work;