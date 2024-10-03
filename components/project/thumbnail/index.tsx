// import Image from "next/image";
// import { Image } from '@mantine/core';
import Image from 'next/image';
import classes from './tn.module.css';

import { ProjectType } from '@/types/types';


type ThumbnailProps = {
  project: ProjectType;
  handleOpen: (project: ProjectType) => void;
}

const Thumbnail = ({ project, handleOpen }: ThumbnailProps) => {

  return (
    <div className={classes.project_container} onClick={() => handleOpen(project)}>
      <Image src={project.thumbnail} className={classes.project_image}
        alt={project.title}
        width={960}
        height={540}
      />
      <div className={classes.project_title}>{project.title}</div>
    </div>

  );
};

export default Thumbnail;
