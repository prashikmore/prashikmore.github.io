import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
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
import {
  fetchSkillsData,
  fetchExperiences,
  fetchEducation,
  fetchProjects,
} from "./data/SupabaseData";

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
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [skillsData, experiencesData, educationData, projectsData] =
        await Promise.all([
          fetchSkillsData(),
          fetchExperiences(),
          fetchEducation(),
          fetchProjects(),
        ]);

      setSkills(skillsData.data || []);
      setExperiences(experiencesData.data || []);
      setEducation(educationData.data || []);
      setProjects(projectsData.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div>Loading...</div>
        </SkeletonTheme>
      </ThemeProvider>
    );
  }

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
                {(skills.length > 0 || experiences.length > 0) && (
                  <Wrapper>
                    {skills.length > 0 && <Skills />}
                    {experiences.length > 0 && <Experience />}
                  </Wrapper>
                )}
                {projects.length > 0 && (
                  <Projects openModal={openModal} setOpenModal={setOpenModal} />
                )}
                {education.length > 0 && (
                  <Wrapper>
                    {education.length > 0 && <Education />}
                    <Contact />
                  </Wrapper>
                )}
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
