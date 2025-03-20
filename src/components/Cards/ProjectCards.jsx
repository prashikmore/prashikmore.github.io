import React, { memo, useState, useCallback } from "react";
import styled from "styled-components";

const Button = styled.button`
  display: none;
  width: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.text_black};
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.8s ease-in-out;
`;
const Card = styled.div`
  width: 330px;
  height: 490px;
  background-color: ${({ theme }) => theme.card};
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.5s ease-in-out;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.6);
    filter: brightness(1.1);
  }
  &:hover ${Button} {
    display: block;
  }
`;

// Update the Image styled component
const Image = styled.img`
  width: 100%;
  height: 180px;
  background-color: ${({ theme }) => theme.card_light};
  border-radius: 10px;
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  ${({ isLoading }) =>
    isLoading &&
    `
    filter: blur(10px);
    transition: filter 0.3s ease-out;
  `}
`;

const Tags = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary + 15};
  padding: 2px 8px;
  border-radius: 10px;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0px 2px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Date = styled.div`
  font-size: 12px;
  margin-left: 2px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 80};
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const Description = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 99};
  overflow: hidden;
  margin-top: 8px;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const Members = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  margin-bottom: ${(props) =>
    props.isLast ? "0" : "8px"}; // Add margin between sections
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 12px;
  margin-left: -10px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 3px solid ${({ theme }) => theme.card};
`;

const MemberAvatar = styled(Avatar)`
  border: 2px solid ${({ theme }) => theme.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const AssociationAvatar = styled(Avatar)`
  border: 2px solid ${({ theme }) => theme.text_secondary};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

// Replace the optimizeImageUrl implementation
const optimizeImageUrl = (url) => {
  if (!url || url === "https://via.placeholder.com/150") return url;
  if (url.includes("format=webp")) return url;
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_330,h_180,f_auto,q_auto/");
  }
  return url;
};

// Update OptimizedImage component
const OptimizedImage = memo(({ src, alt, onLoad, onError, isLoading }) => {
  const optimizedSrc = optimizeImageUrl(src);

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={onLoad}
      onError={onError}
      isLoading={isLoading}
    />
  );
});

// Update OptimizedAvatar component
const OptimizedAvatar = memo(({ member, type, placeholderImage, onError }) => {
  const AvatarComponent = type === "member" ? MemberAvatar : AssociationAvatar;
  const optimizedSrc = optimizeImageUrl(member.img) || placeholderImage;

  return (
    <AvatarComponent
      src={optimizedSrc}
      alt={`${type === "member" ? "Team member" : "Association"} ${
        member.name || ""
      }`}
      loading="lazy"
      decoding="async"
      onError={onError}
    />
  );
});

// Update ProjectCards component
const ProjectCards = memo(({ project, setOpenModal }) => {
  // Replace the static placeholder with a dynamic one
  const placeholderImage = `https://placehold.co/330x180/1d1836/ffffff?text=${
    project.title?.charAt(0) || "?"
  }`;
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(
    (e) => {
      e.target.src = placeholderImage;
      setImageLoaded(true); // Remove loading blur when showing placeholder
    },
    [placeholderImage]
  );

  // Update the OptimizedAvatar error handling
  const handleAvatarError = useCallback((e) => {
    const initial = e.target.alt?.charAt(0) || "?";
    e.target.src = `https://placehold.co/40x40/1d1836/ffffff?text=${initial}`;
  }, []);

  // Update the optimizedProjectImage with fallback
  const optimizedProjectImage = optimizeImageUrl(project.image);

  const handleCardClick = useCallback(() => {
    setOpenModal({ state: true, project });
  }, [project, setOpenModal]);

  return (
    <Card onClick={handleCardClick}>
      <OptimizedImage
        src={optimizedProjectImage}
        alt={project.title}
        onLoad={handleImageLoad}
        onError={handleImageError}
        isLoading={!imageLoaded}
      />

      <Tags>
        {project.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Tags>

      <Details>
        <Title>{project.title}</Title>
        <Date>{project.date}</Date>
        <Description>{project.description}</Description>
      </Details>

      {project.members?.length > 0 && (
        <Members>
          {project.members.map((member) => (
            <OptimizedAvatar
              key={member.id}
              member={member}
              type="member"
              placeholderImage={`https://placehold.co/40x40/1d1836/ffffff?text=${
                member.name?.charAt(0) || "?"
              }`}
              onError={handleAvatarError}
            />
          ))}
        </Members>
      )}

      {project.associations?.length > 0 && (
        <Members isLast>
          {project.associations.map((assoc) => (
            <OptimizedAvatar
              key={assoc.id}
              member={assoc}
              type="association"
              placeholderImage={`https://placehold.co/40x40/1d1836/ffffff?text=${
                assoc.name?.charAt(0) || "?"
              }`}
              onError={handleAvatarError}
            />
          ))}
        </Members>
      )}
    </Card>
  );
});

// Add display names for better debugging
ProjectCards.displayName = "ProjectCards";
OptimizedImage.displayName = "OptimizedImage";
OptimizedAvatar.displayName = "OptimizedAvatar";

export default ProjectCards;
