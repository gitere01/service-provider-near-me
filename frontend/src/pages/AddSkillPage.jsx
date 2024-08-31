import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import TopNavBar from "../components/TopNavBar";
import { v4 as uuidv4 } from "uuid";

const AddSkillPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [education, setEducation] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({ category_name: "", category_id: "" });
  const [categories, setCategories] = useState([]);
  const [gender, setGender] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [currency, setCurrency] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState({
    country: '',
    city: '',
    custom_location: ''
  });
  const [note, setNote] = useState("");
  const [workImages, setWorkImages] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notification, setNotification] = useState("");
  const [experienceYear, setExperienceYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    setUser(data.session?.user ?? null);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("category_id, category_name");
    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }
    setCategories(data);
  };

  const africanCurrencies = [
    { code: "KES", name: "Kenyan Shilling" },
    { code: "TZS", name: "Tanzanian Shilling" },
    { code: "UGX", name: "Ugandan Shilling" },
  ];

  const defaultLanguages = ["English", "Kiswahili"];

  const handleFileUpload = async (file) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData) {
        throw new Error("User not found or authentication error");
      }

      const filename = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filename, file, {
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

      if (!data?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      return data.publicUrl;
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        setImage(imageUrl);
      }
    }
  };

  const handleWorkImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const imageUrl = await handleFileUpload(file);
        return imageUrl;
      })
    );

    setWorkImages((prevImages) => [...prevImages, ...imageUrls.filter(Boolean)].slice(0, 6));
  };

  const handleRemoveWorkImage = (index) => {
    setWorkImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!image) {
        throw new Error("Please upload an image");
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("User not found");
      }

      const userUid = uuidv4();

      const { data: skillData, error: skillError } = await supabase
        .from("skills")
        .insert([
          {
            user_uid: userUid,
            name,
            id_number: idNumber,
            passport_number: passportNumber,
            education,
            description,
            age,
            experienceYear,
            language,
            gender,
            country: location.country,
            city: location.city,
            custom_location: location.custom_location,
            expected_salary: expectedSalary,
            currency,
            category_name: selectedCategory.category_name,
            category_id: selectedCategory.category_id,
            image,
            note,
            phone_number: phoneNumber,
            vetted: false,
            work_images: JSON.stringify(workImages),
          },
        ]);

      if (skillError) {
        throw skillError;
      }

      setNotification("Skill added successfully!");
      setFormSubmitted(true);
      setName("");
      setIdNumber("");
      setPassportNumber("");
      setEducation("");
      setDescription("");
      setAge("");
      setLanguage("");
      setSelectedCategory({ category_name: "", category_id: "" });
      setGender("");
      setExperienceYear("");
      setExpectedSalary("");
      setLocation({ country: '', city: '', custom_location: '' });
      setCurrency("");
      setImage(null);
      setImageFile(null);
      setNote("");
      setPhoneNumber("");
      setWorkImages([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopNavBar />

      <div className="max-w-2xl mx-auto mt-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4">Add Your Service</h2>

          {notification && (
            <p className="text-green-500 mb-4">{notification}</p>
          )}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your name or business name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
              Your National ID Number (provide if you want to be verified)
            </label>
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
              Your Passport Number (provide if you want to be verified)
            </label>
            <input
              type="text"
              id="passportNumber"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category_name"
              value={selectedCategory.category_name}
              onChange={(e) => {
                const selected = categories.find(cat => cat.category_name === e.target.value);
                setSelectedCategory({ category_name: selected?.category_name || "", category_id: selected?.category_id || "" });
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              type="text"
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">Select a language</option>
              {defaultLanguages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="experienceYear" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              id="experienceYear"
              value={experienceYear}
              onChange={(e) => setExperienceYear(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700">
              Expected Salary
            </label>
            <input
              type="text"
              id="expectedSalary"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            >
              <option value="">Select a currency</option>
              {africanCurrencies.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
            {image && (
              <img src={image} alt="Profile" className="mt-4 w-32 h-32 object-cover rounded-full" />
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="country"
              placeholder="Country"
              value={location.country}
              onChange={(e) => setLocation({ ...location, country: e.target.value })}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
            <input
              type="text"
              id="city"
              placeholder="City"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
            <input
              type="text"
              id="custom_location"
              placeholder="Custom Location"
              value={location.custom_location}
              onChange={(e) => setLocation({ ...location, custom_location: e.target.value })}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Additional Note
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
              rows="2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="workImages" className="block text-sm font-medium text-gray-700">
              Work Images
            </label>
            <input
              type="file"
              id="workImages"
              multiple
              onChange={handleWorkImagesChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
            <div className="mt-4">
              {workImages.map((url, index) => (
                <div key={index} className="relative inline-block mr-4">
                  <img src={url} alt={`Work Image ${index}`} className="w-32 h-32 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveWorkImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSkillPage;
