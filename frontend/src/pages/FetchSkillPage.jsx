import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const FetchSkillPage = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase.from("skills").select("*");

        if (error) {
          throw error;
        }

        console.log("Fetched skills data:", data); // Log the entire data object
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error.message);
      }
    };

    fetchSkills();
  }, []);

  const handleDelete = async (skillId) => {
    try {
      const { error } = await supabase.from("skills").delete().eq("skill_id", skillId); // Use the correct column name

      if (error) {
        throw error;
      }

      setSkills((prevSkills) => prevSkills.filter((skill) => skill.skill_id !== skillId)); // Use the correct column name
    } catch (error) {
      console.error("Error deleting skill:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Added Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skills.map((skill, index) => {
          const id = skill.skill_id || skill.id; // Use the correct property or handle undefined case
          console.log("Rendering skill with id:", id);
          return (
            <div key={`${id}-${index}`} className="bg-white shadow-lg rounded-lg p-6">
              <img
                src={skill.image}
                alt="Skill Image"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{skill.name}</h2>
              <p className="text-gray-700 mb-2">{skill.description}</p>
              
              <p className="text-gray-700 mb-2">
                <strong>Age:</strong> {skill.age}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Language:</strong> {skill.language}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Gender:</strong> {skill.gender}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Country:</strong> {skill.country}
              </p>
             <p className="text-gray-700 mb-2">
                <strong>Expected Salary:</strong> {skill.expected_salary} {skill.currency}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Note:</strong> {skill.note}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Skills:</strong> {skill.category_name}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Location:</strong> {skill.locationName}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone Number:</strong> {skill.phone_number}
              </p>
              
              <div className="flex justify-between">
                <Link
                  to={`/update/${id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FetchSkillPage;
