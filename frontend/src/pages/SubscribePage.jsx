import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';


const SubscribePage = ({ onSubscription }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [error, setError] = useState(null);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubscribe = async () => {
    try {
      // Make API call to Safaricom API
      const safaricomResponse = await fetch('Safaricom_API_Endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: 1000, // Subscription amount in KES
          duration: 'MONTHLY', // Subscription duration
        }),
      });

      if (!safaricomResponse.ok) {
        throw new Error('Failed to subscribe');
      }

      const safaricomData = await safaricomResponse.json();
      if (safaricomData.success) {
        // Subscription successful, now save data to Supabase
        const supabaseResponse = await fetch('Supabase_API_Endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_SUPABASE_API_KEY',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            subscriptionStatus: 'active', // Or whatever status you want to set
            // Add any additional subscription data you want to save
          }),
        });

        if (!supabaseResponse.ok) {
          throw new Error('Failed to save subscription data');
        }

        setSubscriptionStatus('active');
        onSubscription('active');
      } else {
        setSubscriptionStatus('Subscription failed');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setError('Failed to subscribe');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
  <TopNavBar />
  
  <div className="container mx-auto px-4 flex flex-col items-center flex-grow">
    <h1 className="text-2xl font-bold my-4">Subscribe</h1>
    <div className="flex flex-wrap justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 mt-4 mx-2 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Subscription Details</h2>
        <div>
          <p className="mb-2">To Access Phone number:</p>
          <ul className="list-disc pl-5">
            <li>Nannies</li>
            <li>Caregivers</li>
            <li>Househelps</li>
            <li>Security Guards</li>
            <li>Private Drivers</li>
            <li>Tutor</li>
          </ul>
        </div>
        <p className="mb-2 font-semibold">Subscription Fee: 1000 KES monthly </p>
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter your phone number"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleSubscribe}
          className="bg-black text-white px-4 py-2 rounded-md mt-4 w-full"
        >
          Subscribe
        </button>
        {subscriptionStatus && <p className="text-green-500">{subscriptionStatus}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4 mx-2 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Other Services</h2>
        <p className="mb-2">Access Phone numbers and WhatsApp numbers for other service providers it is  free:</p>
        <button onClick={() => window.location.href='/'} className="bg-black text-white px-4 py-2 rounded-md mt-4">
          Go to Homepage
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4 mx-2 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Remove Ads</h2>
        <p className="mb-2">To remove ads, subscribe for 1000 KES annually.</p>
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter your phone number"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleSubscribe}
          className="bg-black text-white px-4 py-2 rounded-md mt-4 w-full"
        >
          Subscribe
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4 mx-2 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="mb-2">Pesapal payment is coming soon! We are currently using Safaricom payment gateway.</p>
      </div>
    </div>
  </div>
</div>

  
  );
};

export default SubscribePage;