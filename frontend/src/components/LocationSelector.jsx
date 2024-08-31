import React, { useState, useEffect } from 'react';

const LocationSelector = ({ onLocationChange }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [customLocation, setCustomLocation] = useState('');

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

  useEffect(() => {
    onLocationChange?.({
      country: selectedCountry,
      city: selectedCity,
      custom_location: customLocation
    });
  }, [selectedCountry, selectedCity, customLocation, onLocationChange]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedCity(''); // Reset selected city when country changes
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleCustomLocationChange = (event) => {
    setCustomLocation(event.target.value);
  };

  return (
    <div className="p-4">
      <label htmlFor="country" className="block text-gray-700">Select Country:</label>
      <select
        id="country"
        value={selectedCountry}
        onChange={handleCountryChange}
        className="block w-full p-2 border rounded"
      >
        <option value="">--Select a Country--</option>
        {Object.keys(countries).map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      {selectedCountry && (
        <>
          <label htmlFor="city" className="block text-gray-700 mt-4">Select City:</label>
          <select
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            className="block w-full p-2 border rounded"
          >
            <option value="">--Select a City--</option>
            {countries[selectedCountry].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </>
      )}

      <label htmlFor="customLocation" className="block text-gray-700 mt-4">Your Location:</label>
      <input
        type="text"
        id="customLocation"
        value={customLocation}
        onChange={handleCustomLocationChange}
        className="block w-full p-2 border rounded"
        placeholder="Enter Your Location"
      />
    </div>
  );
};

export default LocationSelector;
