// src/pages/ProfilePage.jsx
import React from 'react';
import { useLikedSkills } from '../components/LikedSkillsContext';
import SkillCard from '../components/SkillCard';
import TopNavBar from '../components/TopNavBar';

const ProfilePage = () => {
  const { likedSkills } = useLikedSkills();

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Liked Skills</h1>
        {likedSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedSkills.map((skill) => (
              <SkillCard key={skill.skill_id} skill={skill} />
            ))}
          </div>
        ) : (
          <p className="text-center mt-4">You haven't liked any skills yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

