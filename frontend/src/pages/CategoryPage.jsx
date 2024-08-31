import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import { supabase } from "../client";
import TrendingSkills from "./TrendingSkills"; // Import the new component

function CategoryPage() {
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch Categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      // Check for an internet connection
      if (!navigator.onLine) {
        setError("You are currently offline. Please check your internet connection.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: categories, error } = await supabase
        .from('categories')
        .select('category_id, category_name, image_url'); // Adjust fields as needed

      if (error) {
        setError('Error fetching categories. Please try again later.');
        console.error('Error fetching categories:', error);
      } else {
        // Define priority categories
        const priorityCategories = [
          'House agents & landlord',
          'Househelp',
          'Mama fua',
          'Caregiver',
          'Nanny',
          'Local moving',
          'Private Nurse',
          'Drivers',
          'Security guard',
          'Ambulance',
          'Driver',
          'Veterinary',
          'Doctor',
          'Lawyer',
          'Therapist',
          'Private Doctor'
        ];

        // Sort categories: prioritize the ones in priorityCategories list
        const sortedCategories = categories.sort((a, b) => {
          const priorityA = priorityCategories.indexOf(a.category_name);
          const priorityB = priorityCategories.indexOf(b.category_name);

          // If category is not in priorityCategories, move it to the end
          if (priorityA === -1) return 1;
          if (priorityB === -1) return -1;

          // Otherwise, sort by the priority order
          return priorityA - priorityB;
        });

        setCategories(sortedCategories);
        setFilteredCategories(sortedCategories); // Initialize filtered categories
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  // Fetch Trending Skills from Supabase
  const fetchTrendingSkills = async () => {
    const { data, error } = await supabase.rpc("get_trending_skills");

    if (error) {
      console.error("Error fetching trending skills:", error.message);
    } else {
      setTrendingSkills(data);
    }
  };

  useEffect(() => {
    fetchTrendingSkills();
  }, []);

  // Handle search input changes and filter categories accordingly
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) =>
          category.category_name
            ? category.category_name.toLowerCase().includes(value.toLowerCase())
            : false
        )
      );
    }
  };

  // Handle category click and fetch related skills
  const handleCategoryClick = async (categoryId, categoryName) => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("category_id", categoryId); // Filtering by category_id
  
      if (error) {
        console.error("Error fetching skills:", error.message);
      } else {
        // Navigate with categoryId instead of categoryName
        navigate(`/home?category_id=${categoryId}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  

  return (
    <div>
      <TopNavBar />

      <div className="container mx-auto mt-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search Categories"
            className="border border-gray-300 rounded-md px-4 py-2"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>
        {loading && categories.length === 0 ? (
          <div className="flex justify-center items-center mt-8">
            <div className="loader">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center mt-8">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="mt-4">
            <h1>Browse by Category</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.category_id}
                  className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
                  onClick={() =>
                    handleCategoryClick(
                      category.category_id,
                      category.category_name
                    )
                  }
                >
                  <div className="w-full h-40">
                    <img
                      src={category.image_url}
                      alt={category.category_name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-bold">
                      {category.category_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <TrendingSkills
          trendingSkills={trendingSkills}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

export default CategoryPage;
