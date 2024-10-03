import React, { useState, useEffect } from "react";

import Gallery from "../../components/project/gallery";
import GalleryFilter from "../../components/GalleryFilter";
import { ProjectType } from "../../types/types";
import { GetServerSideProps } from "next";

interface WorkProps {
	projects: ProjectType[];
	tags: string[];
}

const Work = (props: WorkProps) => {
	const [projects, setProjects] = useState<ProjectType[]>(props.projects);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const handleTagChange = (_tags: string[]) => {
		setSelectedTags(_tags);
	};

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch("/api/getSiteData");
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

	return (
		<React.Fragment>
			<GalleryFilter
				tags={props.tags}
				handleTagsChange={handleTagChange}></GalleryFilter>
			<Gallery projects={projects} selectedTags={selectedTags}></Gallery>
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
