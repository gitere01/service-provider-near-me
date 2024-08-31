import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../client";
import TopNavBar from "../components/TopNavBar";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";


const UpdateSkillPage = () => {
  const { skillId } = useParams(); // Get the skill ID from the URL parameters
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [education, setEducation] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [experienceYear, setExperienceYear] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [currency, setCurrency] = useState("");
  const [category_name, setCategory_name] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState(null);
  const [note, setNote] = useState("");
  const [workImages, setWorkImages] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Skill options and other constants
  const africanCurrencies = [
    { code: "KES", name: "Kenyan Shilling" },
    { code: "TZS", name: "Tanzanian Shilling" },
    { code: "UGX", name: "Ugandan Shilling" },
  ];

  const countries = ["Kenya", "Tanzania", "Uganda"];
  const defaultLanguages = ["English", "Kiswahili"];

  const skillOptions = [
    "Landscaping",
    "Nanny",
    "Caregiver",
    "Security guard",
    "Photographer",
    "DJ",
    "Baker",
    "Rent a car",
    "Mama fua",
    "Errands",
    "Make up & beauty",
    "Cook & Chef",
    "Fridge repair",
    "DSTV installation",
    "pest control",
    "Local moving",
    "Daycare",
    "water vendors",
    "water tankers delivery",
    "Fashion & Design",
    "House cleaning",
    "Minor home repair",
    "Tailor",
    "Therapist",
    "car cleaner",
    "Handyman",
    "Carpet cleaning",
    "Caregiver",
    "Airbnb cleaning",
    "CCTV installler",
    "Smart Home installs",
    "Web Designer",
    "Blog writer",
    "Fitness Trainer",
    "Gym Repair Tech",
    "Bike Technician",
    "Safari Tour Agents",
    "Masons",
    "Welder",
    "phone repair",
    "Window Cleaning",
    "Tax Preparation",
    "House Remodel",
    "Sofa cleaning",
    "Deep cleaning",
    "Cabinet Installation",
    "Tv Repair",
    "Oven & Microwave repair",
    "Mobile Auto Repair",
    "Mobile barber",
    "Architects",
    "Solar installation",
    "Graphic Designer",
    "Math Tutoring",
    "English Tutoring",
    "general contractor",
    "Logistic",
    "Ambulance",
    "Lawyer",
    "Private Nurse",
    "Private Doctor",
    "Event Planner",
    "guitarist",
    "Drumist",
    "Painter",
    "kids facepainter",
    "mc",
    "Veterinary",
    "Mechanic",
    "Dog trainer",
    "Team building",
  ];

  const uniqueSkillOptions = [...new Set(skillOptions)];

  const handleLocationChange = (loc) => {
    setLocation(loc);
    setLocationAdded(true);
  };

  const handleLocationNameChange = (name) => {
    setLocationName(name);
  };

  useEffect(() => {
    fetchUser();
    if (skillId) {
      fetchSkill(); // Fetch the skill data to update
    }
  }, [skillId]);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    setUser(data.user);
  };

  const fetchSkill = async () => {
    try {
      if (!skillId) {
        throw new Error('Invalid skillId');
      }

      const { data: skillData, error } = await supabase
        .from('skills')
        .select('*')
        .eq('skill_id', skillId)
        .single();

      if (error) {
        throw error;
      }

      populateForm(skillData);
    } catch (error) {
      console.error('Error fetching skill:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (skillData) => {
    if (!skillData) {
      console.error("No skill data to populate the form");
      return;
    }
    setName(skillData.name);
    setIdNumber(skillData.id_number);
    setPassportNumber(skillData.passport_number);
    setEducation(skillData.education);
    setDescription(skillData.description);
    setAge(skillData.age);
    setExperienceYear(skillData.experience_year); // Corrected
    setLanguage(skillData.language);
    setGender(skillData.gender);
    setCountry(skillData.country);
    setCountry(skillData.city);
    setExpectedSalary(skillData.expected_salary);
    setCurrency(skillData.currency);
    setCategory_name(skillData.category_name);
    setImage(skillData.image);
    setLocation(skillData.location ? JSON.parse(skillData.location) : null);
    setLocationName(skillData.location_name);
    setPhoneNumber(skillData.phone_number);
    setWorkImages(
      skillData.work_images ? JSON.parse(skillData.work_images) : []
    );
    setNote(skillData.note);
  };

  const handleFileUpload = async (file) => {
    try {
      const blob = new Blob([file], { type: file.type });
      const filename = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filename, blob, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = await supabase.storage
        .from("images")
        .getPublicUrl(filename);

      return data.publicUrl;
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      return null;
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const imageUrl = await handleFileUpload(file);
    setImage(imageUrl);
  };

  const handleWorkImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = [];

    for (const file of files) {
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    }

    setWorkImages((prevImages) => [...prevImages, ...imageUrls].slice(0, 6));
  };

  const handleRemoveWorkImage = (index) => {
    setWorkImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!skillId) {
      setError("Skill ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("skills")
        .update({
          name,
          id_number: idNumber,
          passport_number: passportNumber,
          education,
          description,
          age,
          experienceYear, // Fixed property name
          language,
          gender,
          country,
          city,
          expected_salary: expectedSalary,
          currency,
          category_name,
          image,
          location: location ? JSON.stringify(location) : null,
          locationName, // Fixed property name
          phone_number: phoneNumber,
          work_images: JSON.stringify(workImages),
          note,
        })
        .eq("skill_id", skillId);

      if (error) {
        throw error;
      }

      setNotification("Skill updated successfully.");
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error updating skill:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopNavBar />
    
      <InterstitialAd />

      <div className="max-w-2xl mx-auto mt-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4">Update Your Service</h2>

          {notification && (
            <p className="text-green-500 mb-4">{notification}</p>
          )}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
  <label
    htmlFor="name"
    className="block text-sm font-medium text-gray-700"
  >
    Your name or business name
  </label>
  <input
    type="text"
    id="name"
    value={name || ""} // Fallback to an empty string
    onChange={(e) => setName(e.target.value)}
    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
  />
</div>


          <div className="mb-4">
            <label
              htmlFor="idNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Your National ID Number (provide if you want to be verified)
            </label>
            <input
              type="text"
              id="idNumber"
              value={idNumber || ""}
              onChange={(e) => setIdNumber(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="passportNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Passport Number (optional)
            </label>
            <input
              type="text"
              id="passportNumber"
              value={passportNumber || ""}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="education"
              className="block text-sm font-medium text-gray-700"
            >
              Your level of Education
            </label>
            <input
              type="text"
              id="education"
              value={education || ""}
              onChange={(e) => setEducation(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Describe your service
            </label>
            <textarea
              id="description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <select
              id="categoryName"
              value={category_name || ""}
              onChange={(e) => setCategory_name(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {uniqueSkillOptions.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>


          {/* Add the rest of the form fields here with similar structure... */}
          <div className="mb-4">
            <label
              htmlFor="experienceYear"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Year
            </label>
            <input
              type="text"
              id="experienceYear"
              value={experienceYear || ""}
              onChange={(e) => setExperienceYear(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="text"
              id="age"
              value={age || ""}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <select
              id="language"
              value={language || ""}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">Select your language</option>
              {defaultLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              value={gender || ""}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <LocationSelector value={location} onChange={setLocation} />
          <div className="mb-4">
            <label
              htmlFor="expectedSalary"
              className="block text-sm font-medium text-gray-700"
            >
              Expected Salary
            </label>
            <input
              type="text"
              id="expectedSalary"
              value={expectedSalary || ""}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency || ""}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">Select your currency</option>
              {africanCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>


          {/* Add fields for education, description, age, language, gender, etc. */}

         
          <div className="mb-4">
  <label
    htmlFor="image"
    className="block text-sm font-medium text-gray-700"
  >
    Profile (only 1 image required)
  </label>
  <input
    type="file"
    id="image"
    accept="image/*"
    onChange={handleImageChange}
    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
  />
  {image ? (
    <img
      src={image}
      alt="Uploaded"
      className="mt-2 h-40 w-40 object-cover"
    />
  ) : (
    <div className="mt-2 h-40 w-40 bg-gray-200 flex items-center justify-center text-gray-500">
      No image selected
    </div>
  )}
</div>


          <div className="mb-4">
  <label
    htmlFor="workImages"
    className="block text-sm font-medium text-gray-700"
  >
    Upload Work Images (maximum 6)
  </label>
  <input
    type="file"
    multiple
    onChange={handleWorkImagesChange}
    accept="image/*"
    className="mt-1 block w-full text-sm text-gray-500
           file:mr-4 file:py-2 file:px-4
           file:rounded-full file:border-0
           file:text-sm file:font-semibold
           file:bg-indigo-50 file:text-indigo-700
           hover:file:bg-indigo-100"
  />
  <div className="grid grid-cols-3 gap-2 mt-2">
    {(workImages || []).map((img, index) => (
      <div key={index} className="relative">
        <img
          src={img}
          alt={`work-${index}`}
          className="w-full h-24 object-cover rounded-md"
        />
        <button
          type="button"
          onClick={() => handleRemoveWorkImage(index)}
          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
        >
          X
        </button>
      </div>
    ))}
  </div>
</div>


          <div className="mb-4">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Notes
            </label>
            <textarea
              id="note"
              value={note || ""}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber || ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <LocationAutocomplete
              setLocation={handleLocationChange}
              setLocationName={handleLocationNameChange}
              placeholder="Enter your location"
              locationAdded={locationAdded}
            />

            {/* Use the location and locationName as needed */}
            {location && (
              <div>
                <p>Selected Location: {locationName}</p>
                <p>
                  Coordinates: Lat {location.lat}, Lng {location.lng}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              To get vetted, please contact us at{" "}
              <a
                href="mailto:gitere01@gmail.com"
                className="text-blue-500 underline"
              >
                gitere01@gmail.com
              </a>
              .
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Skill"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSkillPage;
