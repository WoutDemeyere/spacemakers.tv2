import React, { useRef } from "react";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { GetServerSideProps } from "next";

import { EffectFade, Autoplay } from "swiper/modules";
import Slogan from "../components/Slogan";

import "swiper/css";
import "swiper/css/effect-fade";

import styles from "./Home.module.css";

const images: string[] = [
	"/images/landing/cotf.jpg",
	"/images/landing/ion.jpg",
	"/images/landing/bbr_opt_2.jpg",
	"/images/landing/asa_moto.jpeg",
	"/images/landing/ccd.jpg",
	"/images/landing/obscuur.jpg",
	"/images/landing/nye.jpg",
];

const Home: React.FC = () => {
	const swiperRef = useRef<any | null>(null);

	const handleImageClick = () => {
		swiperRef.current?.slideNext();
	};

	return (
		<React.Fragment>
			<div className={styles.slogan_container}>
				<Slogan />
			</div>

			<Swiper
				allowSlideNext
				loop={true}
				slidesPerView={1}
				modules={[EffectFade, Autoplay]}
				effect="fade"
				className={styles.container}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				onSwiper={(swiper) => {
					swiperRef.current = swiper;
				}}>
				{images.map((el, key) => {
					return (
						<SwiperSlide key={key}>
							<img
								src={el}
								alt={el.split("/").pop()?.split(".")[0]}
								className={styles.carouselImage}
								onClick={() => handleImageClick()}
							/>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</React.Fragment>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	// Fetch your data here
	const title = "spacemakers.tv";
	const description =
		"With Spacemakers we have been experimenting with light, image and sound in public space for about 10 years now. Through different art forms we try to show a space in another dimension. Our portfolio includes various exhibitions, video projections, stage design, light constructions, (interactive) installations, festivals, museums and more.";

	return {
		props: {
			title,
			description,
		},
	};
};

export default Home;
