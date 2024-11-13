import React, { useState } from "react";
import styles from "./filter.module.css";
import { ActionIcon, Flex } from "@mantine/core";
import { IconSquareX } from "@tabler/icons-react";

interface ProjectFilterProps {
    tags: string[];
    handleTagsChange: (selectedTags: string[]) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ tags, handleTagsChange }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        const tag = e.currentTarget.textContent || "";

        let updatedTags;
        if (selectedTags.includes(tag)) {
            updatedTags = selectedTags.filter(item => item !== tag);
        } else {
            updatedTags = [...selectedTags, tag];
        }

        setSelectedTags(updatedTags);
        handleTagsChange(updatedTags.length === tags.length || updatedTags.length === 0 ? [] : updatedTags);
    };

    const clearSelection = () => {
        setSelectedTags([]);
        handleTagsChange([]);
    };

    return (
        <Flex align="center" justify="end" gap="xs" h="xl" p="1rem">
            {tags.map((tag, index) => (
                <button key={index}
                        onClick={handleClicked}
                        className={`${styles.o_button_reset} ${styles.project_filter_item} ${(selectedTags.includes(tag) && selectedTags.length > 0 && selectedTags.length !== tags.length) && styles.selected}`}>
                    {tag}
                </button>
            ))}
            <ActionIcon onClick={clearSelection} className={styles.clear_button} variant="filled" color="black">
                <IconSquareX />
            </ActionIcon>
        </Flex>
    );
};

export default ProjectFilter;