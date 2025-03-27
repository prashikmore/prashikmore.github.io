import React, { useState, useEffect } from "react";
import {
  Nav,
  NavLink,
  NavbarContainer,
  Span,
  NavLogo,
  NavItems,
  GitHubButton,
  ButtonContainer,
  MobileIcon,
  MobileMenu,
  MobileNavLogo,
  MobileLink,
} from "./NavbarStyledComponent";
import { FaBars } from "react-icons/fa";
import { Close, CloseRounded } from "@mui/icons-material";
import { useTheme } from "styled-components";
import {
  fetchBioData,
  fetchSkillsData,
  fetchExperiences,
  fetchEducation,
  fetchProjects,
} from "../../api/supabase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const getBioData = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchBioData();
        if (!error && data) {
          setBioData(data);
        }
      } catch (error) {
        console.error("Error fetching bio data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Check which sections have data
    const checkSections = async () => {
      const [skills, experiences, education, projects] = await Promise.all([
        fetchSkillsData(),
        fetchExperiences(),
        fetchEducation(),
        fetchProjects(),
      ]);

      setSections({
        skills: (skills.data || []).length > 0,
        experience: (experiences.data || []).length > 0,
        education: (education.data || []).length > 0,
        projects: (projects.data || []).length > 0,
      });
    };

    getBioData();
    checkSections();
  }, []);

  const navLinks = [
    { id: "about", label: "About", alwaysShow: true },
    { id: "skills", label: "Skills", show: sections.skills },
    { id: "experience", label: "Experience", show: sections.experience },
    { id: "projects", label: "Projects", show: sections.projects },
    { id: "education", label: "Education", show: sections.education },
  ];

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo>
          <h3 style={{ color: `white` }}>
            {loading ? "Loading..." : bioData?.name || "Portfolio"}
          </h3>
        </NavLogo>
        <MobileIcon>
          <FaBars onClick={() => setIsOpen(!isOpen)} />
        </MobileIcon>
        <NavItems>
          {navLinks.map(
            (link) =>
              (link.alwaysShow || link.show) && (
                <NavLink key={link.id} href={`#${link.id}`}>
                  {link.label}
                </NavLink>
              )
          )}
        </NavItems>
        <ButtonContainer>
          <GitHubButton
            href={bioData?.github}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!bioData?.github}
          >
            Github Profile
          </GitHubButton>
        </ButtonContainer>
        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            {navLinks.map(
              (link) =>
                (link.alwaysShow || link.show) && (
                  <MobileLink
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </MobileLink>
                )
            )}
            <GitHubButton
              style={{
                padding: "10px 16px",
                background: `${theme.primary}`,
                color: "white",
                width: "max-content",
              }}
              href={bioData?.github}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!bioData?.github}
            >
              Github Profile
            </GitHubButton>
          </MobileMenu>
        )}
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
