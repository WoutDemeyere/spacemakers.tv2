import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import { Container, Skeleton } from "@mantine/core"; // Import Mantine components
import parse from "html-react-parser";
import styles from "./project.module.css";

import { Carousel } from '@mantine/carousel';

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
        const response = await fetch(`/api/getProjectById?id=${id}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (slug) {
      const projectData = router.query.project ? JSON.parse(router.query.project as string) : null;
      if (projectData) {
        setProject(projectData);
      } else {
        fetchProject(slug);
      }
    }
  }, [slug]);

  // Render loading state if slug or project is not yet loaded
  if (!slug || !project) {
    return <Skeleton />;
  }

  const handleBack = () => {
    router.push("/work");
  };

  const renderImages = () => {
    return project.image_links.map((image, index) => (
      image && (
        <Carousel.Slide key={index}>
          <img
            src={image}
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
          <p className={styles.modal_description}>
            {parse(project.description)}
          </p>
        </div>

        <div className={styles.modal_images_container}>
          {/* {project.video_links.length !== 0 &&
            project.video_links.map((video, index) => (
              <video
                key={index}
                src={video}
                className={styles.modal_video}
                controls
              />
            ))} */}

          <Carousel >
            {renderImages()}
          </Carousel>

        </div>
      </div>
    </Container>
  );
}
