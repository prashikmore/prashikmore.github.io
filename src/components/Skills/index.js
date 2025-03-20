import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchSkillsWithCategories } from "../../api/supabase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

export const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SkillsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  gap: 30px;
  justify-content: center;
`;

const Skill = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: ${({ theme }) => theme.card};
  border: 0.1px solid #854ce6;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  border-radius: 16px;
  padding: 18px 36px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(133, 76, 230, 0.3);
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 10px 36px;
  }
  @media (max-width: 500px) {
    max-width: 330px;
    padding: 10px 36px;
  }
`;

const SkillTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 20px;
  text-align: center;
`;

const SkillList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const SkillItem = styled(motion.div)`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary + 80};
  border: 1px solid ${({ theme }) => theme.text_primary + 80};
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.card + 99};
    border: 1px solid #854ce6;
    box-shadow: 0 0 10px rgba(133, 76, 230, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 12px;
  }
  @media (max-width: 500px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const SkillImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: transform 0.3s ease;

  ${SkillItem}:hover & {
    transform: scale(1.2);
  }
`;

const Skills = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchSkillsWithCategories();
        if (error) throw error;
        setSkillsData(data);
      } catch (error) {
        console.error("Error fetching skills:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const skillVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading)
    return (
      <Container id="skills">
        <Wrapper>
          <Title>Skills</Title>
          <Desc>Loading skills...</Desc>
        </Wrapper>
      </Container>
    );

  if (error)
    return (
      <Container id="skills">
        <Wrapper>
          <Title>Skills</Title>
          <Desc>Error: {error}</Desc>
        </Wrapper>
      </Container>
    );

  return (
    <Container id="skills">
      <Wrapper>
        <Title>Skills</Title>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SkillsContainer>
            {skillsData.map((category) => (
              <Skill
                key={category.id}
                variants={skillVariants}
                whileHover={{ scale: 1.02 }}
              >
                <SkillTitle>{category.title}</SkillTitle>
                <SkillList>
                  {category.skills.map((item) => (
                    <SkillItem
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.image && (
                        <SkillImage src={item.image} alt={item.name} />
                      )}
                      {item.name}
                    </SkillItem>
                  ))}
                </SkillList>
              </Skill>
            ))}
          </SkillsContainer>
        </motion.div>
      </Wrapper>
    </Container>
  );
};

export default Skills;
