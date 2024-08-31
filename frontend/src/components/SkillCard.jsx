import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLikedSkills } from './LikedSkillsContext';

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const { addLikedSkill, removeLikedSkill, likedSkills } = useLikedSkills();
  

  const handleDetailsClick = () => {
    if (skill?.skill_id) {
      navigate(`/details/${skill.skill_id}`, { state: { skill } });
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      removeLikedSkill(skill.skill_id);
    } else {
      addLikedSkill(skill);
    }
    setIsLiked(!isLiked);
  };

  const {
    name,
    description,
    age,
    education,
    country,
    category_name,
    currency,
    expected_salary,
    language,
    gender,
    experienceYear,
    locationName,
    image,
  } = skill;

  return (
    <div className="w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 flex items-center">
        <div className="w-1/3 mr-4 flex justify-center">
          <img
            src={image}
            alt={name}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-2/3 relative">
          <h2 className="text-xl font-bold">{name || 'Unnamed Skill'}</h2>
          
          {description && <p className="text-gray-700 mb-2"><strong>Description:</strong> {description}</p>}
          {age && <p className="text-gray-700 mb-2"><strong>Age:</strong> {age}</p>}
          {education && <p className="text-gray-700 mb-2"><strong>Education:</strong> {education}</p>}
          {country && <p className="text-gray-700 mb-2"><strong>Country:</strong> {country}</p>}
          {locationName && <p className="text-gray-700 mb-2"><strong>Location:</strong> {locationName}</p>}
          {category_name && <p className="text-gray-700 mb-2"><strong>Service:</strong> {category_name}</p>}
          {expected_salary && currency && (
            <p className="text-gray-700 mb-2">
              <strong>Expected Salary:</strong> {currency} {expected_salary}
            </p>
          )}
          {language && <p className="text-gray-700 mb-2"><strong>Language:</strong> {language}</p>}
          {gender && <p className="text-gray-700 mb-2"><strong>Gender:</strong> {gender}</p>}
          {experienceYear && <p className="text-gray-700 mb-2"><strong>Experience Year:</strong> {experienceYear}</p>}
          
          <button
            onClick={handleDetailsClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Read More
          </button>
         
          <div className="absolute top-0 right-0">
            <button
              onClick={toggleLike}
              className={`text-2xl ${isLiked ? 'text-red-500' : 'text-gray-500'} focus:outline-none`}
              aria-label="Like"
            >
              <i className={`fas ${isLiked ? 'fa-heart' : 'fa-heart'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
