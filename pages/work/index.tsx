import React, { useState, useEffect, useRef } from "react";

import Gallery from "../../components/project/gallery";
import GalleryFilter from "../../components/GalleryFilter";
import { GetServerSideProps } from "next";
import type { ProjectType } from '../../types/types';
import { LoadingOverlay, Skeleton } from "@mantine/core";
const baseUrl = "http://127.0.0.1:8090";

interface WorkProps {
	projects: ProjectType[];
	tags: string[];
}
  

const Work = (props: WorkProps) => {
	const [projects, setProjects] = useState<ProjectType[]>(props.projects);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const isFirstLoad = useRef(true); // Add useRef to track first load

	const handleTagChange = (_tags: string[]) => {
		setSelectedTags(_tags);
	};

	useEffect(() => {
		const fetchProjects = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/getSiteData");

				if (!response.ok) {
					return;
				}

				const data = await response.json();

				const updatedProjects = data.map((project: ProjectType) => {
					project.thumbnail = `${baseUrl}/api/files/${project.collectionId}/${project.id}/${project.thumbnail}`;
					project.images = project.images?.map((image: string) => `${baseUrl}/api/files/${project.collectionId}/${project.id}/${image}`);
					project.videos = project.videos?.map((video: string) => `${baseUrl}/api/files/${project.collectionId}/${project.id}/${video}`);
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

				console.log(updatedProjects);
				setProjects(updatedProjects);
			} catch (error) {
				console.error("Error fetching projects:", error);
			}
			setLoading(false);
		};

		if (isFirstLoad.current) {
			fetchProjects();
			isFirstLoad.current = false; // Set to false after first load
		}
	}, [projects]);

	return (
		<React.Fragment>
			{loading ? <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: "lg"}} loaderProps={{ color: "rgba(0, 0, 0, 1)", size: "lg", type: "dots" }} /> : (
				<>
					<h1 style={{ position: "absolute", left: "-9999px" }}>Spacemakers Work Portfolio</h1>
					<GalleryFilter
						tags={tags}
						handleTagsChange={handleTagChange}></GalleryFilter>
					<Gallery projects={projects} selectedTags={selectedTags}></Gallery>
				</>
			)}
		</React.Fragment>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	// Fetch your data here
	const title = "Work";
	const description =
		"Check out our portfolio of projects. It includes various exhibitions, video projections, stage design, light constructions, (interactive) installations, festivals, museums and more.";

	return {
		props: {
			title,
			description,
		},
	};
};

export default Work;
