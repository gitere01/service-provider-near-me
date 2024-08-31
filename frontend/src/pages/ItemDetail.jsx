import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client"; // Adjust the import path as necessary
import TopNavBar from '../components/TopNavBar';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "leaflet/dist/leaflet.css";

const ItemDetail = () => {
  const { skill_id } = useParams();
  const [skill, setSkill] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [chargeAmount, setChargeAmount] = useState(100); // Default charge for other categories

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const { data: skillData, error } = await supabase
          .from("skills")
          .select("*")
          .eq("skill_id", skill_id)
          .single();

        if (error) {
          throw error;
        }

        setSkill(skillData);

        // Set charge amount based on category if the provider is vetted
        if (skillData.vetted) {
          const category = skillData.category_name.toLowerCase();
          const charge = ['househelp', 'caregiver', 'security guard'].includes(category) ? 500 : 100;
          setChargeAmount(charge);
        }

        // Check subscription status
        const user = supabase.auth.user();
        if (user) {
          const { data: subscriptionData, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_uid', user.id)
            .eq('skill_id', skill_id)
            .single();

          if (subError) throw subError;

          if (subscriptionData) {
            const now = new Date();
            const endDate = new Date(subscriptionData.end_date);
            setIsSubscribed(now <= endDate);
          }
        }
      } catch (error) {
        console.error("Error fetching skill:", error.message);
      }
    };

    fetchSkill();
  }, [skill_id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: reviewData, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("skill_id", skill_id);

        if (error) {
          throw error;
        }

        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      }
    };

    fetchReviews();
  }, [skill_id]);

  const handleSubscribe = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: chargeAmount, // Use the determined charge amount
          phoneNumber: phoneNumber
        })
      });

      const data = await response.json();
      console.log('STK Push response:', data);

      if (data.ResponseCode === '0') {
        // Payment successful, add subscription to Supabase
        const user = supabase.auth.user();
        if (user) {
          const now = new Date();
          const endDate = new Date(now.setMonth(now.getMonth() + 1)); // Set subscription to 1 month

          const { error } = await supabase.from('subscriptions').upsert({
            user_uid: user.id,
            skill_id: skill_id,
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
          });

          if (error) throw error;

          alert('Subscription successful! Contact details are now accessible.');
          setIsSubscribed(true);
        }
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating STK Push:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = supabase.auth.user();
      if (!user) {
        alert("You need to be logged in to submit a review.");
        return;
      }

      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            skill_id,
            user_uid: user.id,
            review_text: newReview,
          },
        ]);

      if (error) throw error;

      setReviews([...reviews, data[0]]);
      setNewReview("");
    } catch (error) {
      console.error("Error submitting review:", error.message);
    }
  };

  const handleReport = async () => {
    const reportReason = prompt("Please enter the reason for reporting:");
    if (!reportReason) return;

    try {
      const user = supabase.auth.user();
      if (!user) {
        alert("You need to be logged in to report abuse.");
        return;
      }

      const { error } = await supabase
        .from("reports")
        .insert([
          {
            skill_id,
            user_uid: user.id,
            report_reason: reportReason,
          },
        ]);

      if (error) throw error;
      alert("Report submitted successfully.");
    } catch (error) {
      console.error("Error submitting report:", error.message);
    }
  };

  const workImages = skill ? JSON.parse(skill.work_images || '[]') : [];

  return (
    <div>
      <TopNavBar />

      <div className="max-w-4xl mx-auto p-4">
        {skill?.id_number || skill?.passport_number ? (
          <p className="text-green-500">Verified user</p>
        ) : (
          <p className="text-red-500">Unverified user</p>
        )}
        {skill?.vetted && <p className="text-blue-500">Vetted User</p>}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-2">{skill?.name}</h2>
            {skill?.image && (
              <img
                src={skill.image}
                alt={`${skill.name}'s profile`}
                className="w-50 h-50 object-cover rounded-full mx-auto mt-4"
              />
            )}
            <div className="mb-4">
              <h3 className="font-semibold">Service category</h3>
              <p>{skill?.category_name}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Service description</h3>
              <p>{skill?.description}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Expected Salary</h3>
              <p>
                {skill?.currency} {skill?.expected_salary}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Work Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Work Image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Age</h3>
              <p>{skill?.age}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Level of Education</h3>
              <p>{skill?.education}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Language</h3>
              <p>{skill?.language}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Location name</h3>
              <p>{skill?.locationName}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Gender</h3>
              <p>{skill?.gender}</p>
            </div>

            <div className="mb-4">
              {skill?.vetted && !isSubscribed ? (
                <>
                  <p className="font-semibold text-red-500">You need to subscribe to access contact details.</p>
                  <button
                    onClick={handleSubscribe}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Subscribe for {chargeAmount} {skill?.currency}
                  </button>
                </>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                  <p>Phone Number: {skill?.phone_number}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            <form onSubmit={handleReviewSubmit} className="mb-4">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write a review"
                className="border p-2 w-full h-24 rounded"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Submit Review
              </button>
            </form>
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="mb-2 border-b pb-2">
                  <p>{review.review_text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={handleReport}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Report Abuse
        </button>
      </div>
    </div>
  );
};

export default ItemDetail;
