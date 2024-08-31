// src/components/LikedSkillsContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LikedSkillsContext = createContext();

export const useLikedSkills = () => {
  return useContext(LikedSkillsContext);
};

export const LikedSkillsProvider = ({ children }) => {
  const [likedSkills, setLikedSkills] = useState([]);

  const addLikedSkill = (skill) => {
    setLikedSkills((prevSkills) => [...prevSkills, skill]);
  };

  const removeLikedSkill = (skillId) => {
    setLikedSkills((prevSkills) => prevSkills.filter(skill => skill.skill_id !== skillId));
  };

  return (
    <LikedSkillsContext.Provider value={{ likedSkills, addLikedSkill, removeLikedSkill }}>
      {children}
    </LikedSkillsContext.Provider>
  );
};
