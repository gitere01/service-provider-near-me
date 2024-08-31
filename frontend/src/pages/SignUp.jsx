import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import Typist from "react-typist";
import service from '../assets/images/service-logor.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_UP") {
          setNotification("Check your email for verification link");
          setTimeout(() => {
            navigate("/login");
          }, 5000); // Redirect to login after 5 seconds
        }
      }
    );

    return () => {
      if (authListener && typeof authListener === "function") {
        authListener(); // Call the function to unsubscribe
      }
    };
  }, [navigate]);

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const { user, error } = await supabase
    .auth
    .signUp({
    email: formData.email,
    password: formData.password,
});
  
      if (error) {
        if (error.message.includes("already been used")) {
          setNotification("Email address is already signed up.");
        } else {
          throw error;
        }
      } else {
  
        setNotification("Check your email for verification link");
        setTimeout(() => {
          navigate("/login");
        }, 5000); // Redirect to login after 5 seconds
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  }
  

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      <img src={service} alt="Logo" className="h-8" />
      <Typist className="my-8" cursor={{ show: false }} loop={true}>
        <div>
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 whitespace-nowrap">
            Thanks for visiting service providers near me{" "}
          </p>
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 whitespace-nowrap">
            You are almost there getting service provider you need
          </p>
        </div>
      </Typist>

      <div className="bg-blue p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-red text-2xl mb-4 font-sans">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Fullname"
            name="fullName"
            onChange={handleChange}
            className="bg-gray-200 text-black w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            placeholder="Email"
            name="email"
            onChange={handleChange}
            className="bg-gray-200 text-black w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            onChange={handleChange}
            className="bg-gray-200 text-black w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Submit
          </button>
          {notification && (
            <div className="mt-2 bg-green-100 text-green-900 p-2 rounded">
              {notification}
            </div>
          )}
          <div className="mt-4 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
