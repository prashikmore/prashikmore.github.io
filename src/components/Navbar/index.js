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
import { fetchBioData } from "../../api/supabase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    getBioData();
  }, []);

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
          <NavLink href="#about">About</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#experience">Experience</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#education">Education</NavLink>
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
            <MobileLink href="#about" onClick={() => setIsOpen(false)}>
              About
            </MobileLink>
            <MobileLink href="#skills" onClick={() => setIsOpen(false)}>
              Skills
            </MobileLink>
            <MobileLink href="#experience" onClick={() => setIsOpen(false)}>
              Experience
            </MobileLink>
            <MobileLink href="#projects" onClick={() => setIsOpen(false)}>
              Projects
            </MobileLink>
            <MobileLink href="#education" onClick={() => setIsOpen(false)}>
              Education
            </MobileLink>
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
