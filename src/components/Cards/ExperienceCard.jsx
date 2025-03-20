import React from "react";
import styled from "styled-components";
import { VerticalTimelineElement } from "react-vertical-timeline-component";

const Top = styled.div`
  width: 100%;
  display: flex;
  max-width: 100%;
  gap: 12px;
`;
const Image = styled.img`
  height: 50px;
  border-radius: 10px;
  margin-top: 4px;
  background: ${({ theme }) =>
    theme.card_light}; // Add background for placeholder
  object-fit: cover;

  @media only screen and (max-width: 768px) {
    height: 40px;
  }
`;
const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Role = styled.div`
  font-size: 18px;
  font-weight: 600px;
  color: ${({ theme }) => theme.text_primary + 99};

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const Company = styled.div`
  font-size: 14px;
  font-weight: 500px;
  color: ${({ theme }) => theme.text_secondary + 99};

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const Date = styled.div`
  font-size: 12px;
  font-weight: 400px;
  color: ${({ theme }) => theme.text_secondary + 80};

  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;
const Grade = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 99};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  width: 100%;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary + 99};
  margin-bottom: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const Span = styled.div`
  display: -webkit-box;
  max-width: 100%;
`;
const Skills = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  margin-top: -10px;
`;
const Skill = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary + 99};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CertificateLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-top: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary + "15"};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.primary + "30"};
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media only screen and (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

// Add these new styled components after existing styled components
const CertificateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const CertificateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CertificateTitle = styled.span`
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 500;
`;

const CertificateIssuer = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;

const CertificateThumb = styled.div`
  position: relative;
  width: 120px; // Even smaller thumbnail
  height: 68px; // 16:9 aspect ratio
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0; // Prevents thumbnail from shrinking

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    .overlay {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 768px) {
    width: 100px;
    height: 56px;
  }
`;

const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary + "30"};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.primary + "cc"}; // More opacity
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.white};
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(2px);
`;

const ExperienceCard = ({ experience }) => {
  const placeholderImage = `https://placehold.co/50x50/1d1836/ffffff?text=${
    experience.company?.charAt(0) || "?"
  }`;

  return (
    <VerticalTimelineElement
      icon={
        <img
          width="100%"
          height="100%"
          alt={experience.company}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          src={experience.img}
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
        />
      }
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: "#1d1836",
        color: "#fff",
        boxShadow: "rgba(23, 92, 230, 0.15) 0px 4px 24px",
        backgroundColor: "rgba(17, 25, 40, 0.83)",
        border: "1px solid rgba(255, 255, 255, 0.125)",
        borderRadius: "6px",
      }}
      contentArrowStyle={{ borderRight: "7px solid  rgba(255, 255, 255, 0.3)" }}
      date={experience.date}
    >
      <Top>
        <Image
          src={experience.img}
          alt={experience.company}
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
        />
        <Body>
          <Role>{experience.role}</Role>
          <Company>{experience.company}</Company>
          <Date>{experience.date}</Date>
        </Body>
      </Top>
      <Description>
        {experience.description && <Span>• {experience.description}</Span>}
        <br />
        {experience.description2 && <Span>• {experience.description2}</Span>}
        <br />
        {experience.description3 && <Span>• {experience.description3}</Span>}
        <br />
        {experience.skills && (
          <>
            <Skills>
              <b>Skills:</b>
              <ItemWrapper>
                {experience.skills.map((skill, index) => (
                  <Skill key={index}>• {skill}</Skill>
                ))}
              </ItemWrapper>
            </Skills>
          </>
        )}
        {experience.doc && (
          <CertificateContainer>
            <a
              href={experience.doc}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <CertificateThumb>
                <ThumbImage
                  src={experience.docThumb || experience.doc}
                  alt="Certificate"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/120x68/1d1836/ffffff?text=Certificate";
                  }}
                />
                <Overlay className="overlay">
                  <span>View Certificate</span>
                </Overlay>
              </CertificateThumb>
            </a>
            <CertificateInfo>
              <CertificateTitle>
                {experience.certTitle || "Certificate"}
              </CertificateTitle>
              <CertificateIssuer>
                Issued by {experience.company}
              </CertificateIssuer>
            </CertificateInfo>
          </CertificateContainer>
        )}
      </Description>
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;
