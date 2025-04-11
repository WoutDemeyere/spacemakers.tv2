import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import { Container, Skeleton } from "@mantine/core"; // Import Mantine components
import parse from "html-react-parser";
import styles from "./project.module.css";

import { Carousel } from '@mantine/carousel';
import { API_BASE_URL } from '../../config/vars';


import type { ProjectType } from "@/types/types";
interface PageProps {
  projects: ProjectType[];
}

export default function Page (props: PageProps) {
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const [project, setProject] = useState<ProjectType | null>(null);

  // This useEffect will run when `slug` is changed
  useEffect(() => {
    const fetchProject = async (id: string) => {
      try {
        const response = await fetch(`/api/getProjectByPageId?id=${id}`);
        const data = await response.json();

        if (data.video_links) {
          data.videos = data.video_links.split(',').map((link: string) => link.trim());
        }
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (slug && !project) {
      const projectData = router.query.project ? JSON.parse(router.query.project as string) : null;
      if (projectData) {
        setProject(projectData);
      } else {
        fetchProject(slug);
      }
    }
  }, [slug, project]);

  // Render loading state if slug or project is not yet loaded
  if (!slug || !project) {
    return <Skeleton />;
  }

  const handleBack = () => {
    router.push("/work");
  };

  const renderVideos = () => {
    return project.videos.map((video, index) => (
      <Carousel.Slide key={index}>
      <iframe
        key={index}
        src={video.replace("watch?v=", "embed/").replace("shorts/", "embed/")}
        className={styles.modal_video}

        // style={{ position: 'relative', height: '450px', width: '90%' }}
        allowFullScreen
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'>
      </iframe>
      </Carousel.Slide>
    ));
  }

  console.log("videos: ", project.videos)

  const renderImages = () => {
    return project.images.map((image, index) => (
      image && (
        <Carousel.Slide key={index}>
          <img
            src={`${API_BASE_URL}/api/files/${project.collectionId}/${project.id}/${image}`}
            alt={project.title}
            className={styles.modal_img}
          />
        </Carousel.Slide>
      )
    ));
  };

  return (
    <Container fluid>
      <div className={styles.modal_container}>
        <FiArrowLeft className={styles.back_button} onClick={handleBack} />
        <div className={styles.modal_text_container}>
          <h1 className={styles.modal_title}>{project.title}</h1>
          <div className={styles.modal_description} style={{ textAlign: "justify", marginRight: '60px' }}>
            {parse(project.content)}
          </div>


        </div>
        <div className={styles.modal_images_container}>
          <Carousel withIndicators={false}>
            {project.videos.length !== 0 && renderVideos()}
            {renderImages()}
          </Carousel>
        </div>
      </div>
    </Container>
  )
}
