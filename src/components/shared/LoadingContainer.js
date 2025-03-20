import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
`;

export const LoadingContainer = () => (
  <Container>
    <div>Loading...</div>
  </Container>
);
