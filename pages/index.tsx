import React, { useRef, useState, useEffect } from "react";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { GetServerSideProps } from "next";

import { EffectFade, Autoplay } from "swiper/modules";
import Slogan from "../components/Slogan";

import Image from "next/image";


import "swiper/css";
import "swiper/css/effect-fade";

import styles from "./Home.module.css";

import { API_BASE_URL } from '../config/vars';


// const images: string[] = [
//   "/images/landing/cotf.webp",
//   "/images/landing/ion.webp",
//   "/images/landing/bbr_opt_2.webp",
//   "/images/landing/asa_moto.webp",
//   "/images/landing/ccd.webp",
//   "/images/landing/obscuur.webp",
//   "/images/landing/nye.webp",
// ];

interface Image {
  ORDER: number;
  alt: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  image: string;
  order: number;
  updated: string;
  show: boolean;
  url?: string;
}

const baseUrl = API_BASE_URL;
// const baseUrl = "http://127.0.0.1:8090";

const Home: React.FC = () => {
  const swiperRef = useRef<any | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/getLandingImages');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (Array.isArray(data)) {
          setImages(data.map((image: Image) => ({
            ...image,
            url: `${baseUrl}/api/files/${image.collectionId}/${image.id}/${image.image}`
          })));
        } else {
          console.error("Fetched data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    console.log(images);
  }, [images]);

  const handleImageClick = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <React.Fragment>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Spacemakers</h1>
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
              {el.show ? (
                <Image
                  src={el.url || ""}
                  alt={el.alt}
                  className={styles.carouselImage}
                  onClick={() => handleImageClick()}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div>No image</div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch your data here
  const title = "Spacemakers";
  const description =
    "With Spacemakers we have been experimenting with light, image and sound in public space for 10 years. Through different art forms we try to show a space in another dimension. Our portfolio includes various exhibitions, video projections, stage design, light constructions, (interactive) installations, festivals, museums and more.";

  return {
    props: {
      title,
      description,
    },
  };
};

export default Home;
