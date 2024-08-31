import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import TopNavBar from '../components/TopNavBar';
import { supabase } from '../client';
import { useNavigate, useLocation } from 'react-router-dom';

const SkillCard = lazy(() => import('../components/SkillCard'));

const countries = {
  Kenya: [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kitale", "Malindi", "Naivasha", 
    "Meru", "Nyeri", "Machakos", "Kakamega", "Kericho", "Embu", "Isiolo", "Lamu", "Garissa", 
    "Wajir", "Mandera", "Bungoma", "Busia", "Moyale", "Narok", "Voi", "Lodwar", "Marsabit", 
    "Homa Bay", "Siaya", "Migori", "Kilifi", "Kwale", "Taveta", "Nyahururu", "Nanyuki", 
    "Naro Moru", "Chuka", "Maralal", "Kajiado", "Namanga", "Loitokitok", "Kimilili"
  ],
  Tanzania: [
    "Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar City", "Mbeya", "Morogoro", "Tanga", 
    "Tabora", "Kigoma", "Moshi", "Iringa", "Shinyanga", "Musoma", "Songea", "Mtwara", "Sumbawanga", 
    "Njombe", "Lindi", "Singida", "Bukoba", "Mikumi", "Kilwa Masoko", "Ifakara", "Kibaha", "Bagamoyo", 
    "Mafinga", "Babati", "Korogwe", "Kondoa", "Mpanda", "Tarime", "Chake Chake", "Wete", "Nachingwea", 
    "Kasulu", "Ruvuma", "Manyoni", "Geita", "Kahama"
  ],
  Uganda: [
    "Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu", "Mbale", "Arua", "Fort Portal", "Lira", 
    "Soroti", "Hoima", "Masaka", "Mukono", "Kasese", "Tororo", "Kabale", "Iganga", "Luwero", 
    "Bushenyi", "Pallisa", "Adjumani", "Masindi", "Rukungiri", "Kamuli", "Nebbi", "Kapchorwa", 
    "Katakwi", "Kaberamaido", "Sembabule", "Apac", "Mityana", "Kyenjojo", "Rakai", "Ntungamo", 
    "Bundibugyo", "Kiboga", "Kisoro", "Mayuge", "Bugiri", "Kayunga"
  ]
};

const Homepage = () => {
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    skills: '',
    verificationStatus: '',
    locationName: ''
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category_id');
  
    if (categoryId) {
      setFilters((prevFilters) => ({ ...prevFilters, skills: categoryId }));
    } else {
      console.log('No category_id parameter found in URL');
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('category_id, category_name');
      if (error) {
        console.error('Error fetching categories:', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);

      let query = supabase.from('skills').select('*');

      if (filters.skills) {
        query = query.eq('category_id', filters.skills);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.city) {
        query = query.ilike('locationName', `%${filters.city}%`);
      }

      if (filters.locationName) {
        query = query.ilike('location', `%${filters.locationName}%`);
      }

      if (filters.verificationStatus) {
        if (filters.verificationStatus === 'verified') {
          query = query.or('id_number.is.not.null,passport_number.is.not.null');
        } else if (filters.verificationStatus === 'unverified') {
          query = query.or('id_number.is.null,passport_number.is.null');
        } else if (filters.verificationStatus === 'vetted') {
          query = query.eq('vetted', true);
        }
      }

      const { data: skills, error } = await query;

      if (error) {
        console.error('Error fetching skills:', error.message);
      } else {
        setFilteredSkills(skills);
      }
      setLoading(false);
    };

    fetchSkills();
  }, [filters]);

  const totalFilteredSkills = filteredSkills.length;
  const totalPages = Math.ceil(totalFilteredSkills / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSkills.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCountryChange = (value) => {
    setFilters({ ...filters, country: value, city: '' });
  };

  const handleCityChange = (value) => {
    setFilters({ ...filters, city: value });
  };

  const handleVerificationStatusChange = (value) => {
    setFilters({ ...filters, verificationStatus: value });
  };

  const handleSearch = () => {
    const query = `?category=${filters.skills}&country=${filters.country}&city=${filters.city}&verificationStatus=${filters.verificationStatus}&locationName=${filters.locationName}`;
    navigate(query);
  };

  const handleLikeToggle = async (skillId, isLiked) => {
    try {
      const updatedSkills = filteredSkills.map(skill =>
        skill.skill_id === skillId ? { ...skill, liked: isLiked } : skill
      );
      setFilteredSkills(updatedSkills);

      const { error } = await supabase
        .from('skills')
        .update({ liked: isLiked })
        .match({ skill_id: skillId });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <div>
      <TopNavBar />

      <div className="container mx-auto mt-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            value={filters.skills}
            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <select
            value={filters.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Country</option>
            {Object.keys(countries).map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <select
            value={filters.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
            disabled={!filters.country}
          >
            <option value="">Select City</option>
            {filters.country && countries[filters.country].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select
            value={filters.verificationStatus}
            onChange={(e) => handleVerificationStatusChange(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Verification Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="vetted">Vetted</option>
          </select>
          <input
            type="text"
            value={filters.locationName}
            onChange={(e) => setFilters({ ...filters, locationName: e.target.value })}
            placeholder="Search by location"
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Search
          </button>
        </div>

        <div className="my-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Suspense fallback={<p>Loading skills...</p>}>
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
              >
                {currentItems.map(skill => (
                  <SwiperSlide key={skill.skill_id}>
                    <SkillCard skill={skill} onLikeToggle={handleLikeToggle} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Suspense>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {currentItems.map((skill) => (
                  <SkillCard
                    key={skill.skill_id}
                    skill={skill}
                    onLikeToggle={handleLikeToggle}
                  />
                ))}
              </div>
             

        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Previous
          </button>
          <span className="mx-4 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
