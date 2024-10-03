import React from "react";

import { Container } from "@mantine/core";
import styles from "./about.module.css";
import { GetServerSideProps } from "next";

const About = () => {
	return (
		<div>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Spacemakers About Page info</h1>
			<div className={styles.about_container}>
				<Container className={styles.about_image}>
					<h3>THIS IS</h3>
					<h2>SPACEMAKERS</h2>
					<img src="/images/logo_no_text2.png" alt="logo" />
				</Container>
				<Container className={styles.about_text_container}>
					<Container className={styles.about_text}>
						<h2>What we do?</h2>
						Stagedesign, video mapping, interactive installations and content
						creation
					</Container>

					<Container className={styles.about_text}>
						<h2>Extending reality pixel by pixel</h2>
						With Spacemakers we have been experimenting with light, image and
						sound in public space for about 8 years now. Through different art
						forms we try to show a space in another dimension. Imagination is
						therefore always central. We are not afraid of a challenge, we even
						like to embrace it. Our portfolio now includes various exhibitions,
						video mappings, video projection, stage design, light constructions,
						(interactive) installations and numerous workshops.
					</Container>

					<Container className={styles.about_text}>
						<h2>Who are we?</h2>
						We are a small team of young creatives with a strong passion for
						live music, humour and experiences with a twist. We get goosebumps
						when we hear the word immersive and try to render faster than our
						croque monsieur device. We try to be your extra spicy sauce no
						matter if it is for your event, festival, installation, performance
						or live performance.
					</Container>

					<Container className={styles.about_text}>
						<h2>Team</h2>
						<ul>
							<li>
								<h4>Wout Demeyere</h4>
								<p>Creative coder, Developper </p>
							</li>
							<li>
								<h4>Willem Deschryver</h4>
								<p>System Engineer, Lightning designer, Content creator</p>
							</li>
							<li>
								<h4>Felix Ysenbaert</h4>
								<p>Content creator,, Illustrator, Animator, Veejay</p>
							</li>
						</ul>
					</Container>
					<Container className={styles.about_text}>
						<h2>How did it start?</h2>
						Spacemakers is a project started in a local youth house, Jeugdhuis
						Krak, in a small town called Avelgem, Belgium. The project purely
						grew on a voluntary basis with all members developing their own
						expertise in their field of interest. This created a group of young,
						motivated creators with a skill set ranging from projection mapping,
						animation, stage design to software development, electronics,
						generative art and so much more.{" "}
					</Container>
				</Container>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const title = "About";
	const description =
		"Learn more about Spacemakers, our mission, our team, and how we started.";

	return {
		props: {
			title,
			description,
		},
	};
};

export default About;
