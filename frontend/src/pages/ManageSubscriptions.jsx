import React, { useState, useEffect } from 'react';
import { supabase } from '../client'; // Adjust the import path as necessary

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase.from('subscriptions').select('*');
        if (error) throw error;
        setSubscriptions(data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error.message);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div>
      <h1>Manage Subscriptions</h1>
      {/* Render subscription list */}
      <ul>
        {subscriptions.map(sub => (
          <li key={sub.id}>
            User: {sub.user_uid} | Skill: {sub.skill_id} | Start Date: {sub.start_date} | End Date: {sub.end_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSubscriptions;

 