import React from "react";
import styled from "styled-components";

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledImage = styled.img`
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const OptimizedImage = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <ImageWrapper>
      <StyledImage
        src={src}
        alt={alt}
        $loaded={loaded}
        onLoad={() => setLoaded(true)}
        loading="eager"
        decoding="async"
        {...props}
      />
    </ImageWrapper>
  );
};

export default React.memo(OptimizedImage);
