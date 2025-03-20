import React, { useEffect, useState, Suspense } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import styled, { useTheme } from "styled-components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchBioData } from "../../api/supabase";
import _default from "../../themes/default";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "../../utils/motion";
import {
  HeroContainer,
  HeroBg,
  HeroLeftContainer,
  Img,
  HeroRightContainer,
  HeroInnerContainer,
  TextLoop,
  Title,
  Span,
  SubTitle,
  ResumeButton,
  FloatingImage,
  LoadingContainer,
  ImageContainer,
} from "./HeroStyle";

// Styled components for skeletons
const TextSkeleton = styled(Skeleton)`
  height: 2em;
  width: 200px;
  margin-bottom: 1em;
`;

const ImageSkeleton = styled(Skeleton)`
  width: 400px;
  height: 400px;
  border-radius: 50%;
`;

// Lazy load non-critical components
const Typewriter = React.lazy(() => import("typewriter-effect"));
const Tilt = React.lazy(() =>
  import("react-tilt").then((mod) => ({ default: mod.Tilt }))
);
const HeroBgAnimation = React.lazy(() => import("../HeroBgAnimation"));
const StarCanvas = React.lazy(() => import("../canvas/Stars"));

const HeroSection = () => {
  const [bioData, setBioData] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const placeholderImage = `https://placehold.co/400x400/1d1836/ffffff?text=${
    bioData.name?.charAt(0) || "?"
  }`;

  // Prefetch and cache bio data
  useEffect(() => {
    const preFetchData = async () => {
      const cachedData = sessionStorage.getItem("bioData");
      if (cachedData) {
        setBioData(JSON.parse(cachedData));
        return;
      }

      const { data } = await fetchBioData();
      if (data) {
        sessionStorage.setItem("bioData", JSON.stringify(data));
        setBioData(data);
      }
    };

    preFetchData();
  }, []);

  // Preload hero image
  useEffect(() => {
    if (bioData?.image) {
      const img = new Image();
      img.src = bioData.image;
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageLoaded(true);
        setImageError(true);
      };
    }
  }, [bioData?.image]);

  return (
    <LazyMotion features={domAnimation}>
      <div id="about">
        <HeroContainer>
          <HeroBg>
            <Suspense fallback={null}>
              <StarCanvas />
              <HeroBgAnimation />
            </Suspense>
          </HeroBg>

          <motion.div {...headContainerAnimation}>
            <HeroInnerContainer>
              <HeroLeftContainer>
                <motion.div {...headTextAnimation}>
                  <Title>
                    {bioData.name ? (
                      <>
                        Hi, I am <br /> {bioData.name}
                      </>
                    ) : (
                      <TextSkeleton />
                    )}
                  </Title>
                  <TextLoop>
                    <Span>
                      <Suspense fallback={<TextSkeleton />}>
                        <Typewriter
                          options={{
                            strings: bioData.roles || [],
                            autoStart: true,
                            loop: true,
                            delay: 50,
                          }}
                        />
                      </Suspense>
                    </Span>
                  </TextLoop>
                </motion.div>

                <motion.div {...headContentAnimation}>
                  {bioData.description ? (
                    <SubTitle>{bioData.description}</SubTitle>
                  ) : (
                    <TextSkeleton count={3} />
                  )}
                </motion.div>

                <ResumeButton
                  href={bioData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check Resume
                </ResumeButton>
              </HeroLeftContainer>

              <HeroRightContainer>
                <motion.div {...headContentAnimation}>
                  <Suspense fallback={<ImageSkeleton />}>
                    <Tilt options={{ max: 25, scale: 1.05 }}>
                      <FloatingImage
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <ImageContainer>
                          <Img
                            src={imageError ? placeholderImage : bioData.image}
                            alt={bioData.name || "Profile"}
                            loading="lazy"
                            width="400"
                            height="400"
                            onError={(e) => {
                              e.target.src = placeholderImage;
                              setImageError(true);
                            }}
                            style={{
                              opacity: imageLoaded ? 1 : 0,
                              transition: "opacity 0.3s ease-in-out",
                              backgroundColor: theme.card_light,
                            }}
                          />
                        </ImageContainer>
                      </FloatingImage>
                    </Tilt>
                  </Suspense>
                </motion.div>
              </HeroRightContainer>
            </HeroInnerContainer>
          </motion.div>
        </HeroContainer>
      </div>
    </LazyMotion>
  );
};

export default React.memo(HeroSection);
