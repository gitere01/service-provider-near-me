import React from 'react';
import SkillCard from '../components/SkillCard'; // Correct path to import SkillCard

const TrendingSkillsSection = ({ trendingSkills, searchTerm }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Trending</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trendingSkills.length > 0 ? (
          trendingSkills.map((skill) => (
            <SkillCard
              key={skill.skill_id}
              skill={skill}
              searchQuery={searchTerm}
            />
          ))
        ) : (
          <p>No trending skills available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingSkillsSection;
