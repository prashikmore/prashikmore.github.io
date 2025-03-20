import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme } from "./utils/Themes.js";
import Navbar from "./components/Navbar";
import "./App.css";
import HeroSectionSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Experience from "./components/Experience";
import Education from "./components/Education";
import ProjectDetails from "./components/ProjectDetails";
import styled from "styled-components";
import { HashRouter } from "react-router-dom";
import StarCanvas from "./components/canvas/Stars";
import { AnimatePresence } from "framer-motion";
import { SkeletonTheme } from "react-loading-skeleton";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  return (
    <ThemeProvider theme={darkTheme}>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <HashRouter>
          <Navbar />
          <Body>
            <StarCanvas />
            <AnimatePresence>
              <div>
                <HeroSectionSection />
                <Wrapper>
                  <Skills />
                  <Experience />
                </Wrapper>
                <Projects openModal={openModal} setOpenModal={setOpenModal} />
                <Wrapper>
                  <Education />
                  <Contact />
                </Wrapper>
                <Footer />

                {openModal.state && (
                  <ProjectDetails
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  />
                )}
              </div>
            </AnimatePresence>
          </Body>
        </HashRouter>
      </SkeletonTheme>
    </ThemeProvider>
  );
}

export default App;
