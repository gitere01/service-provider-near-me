const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const moment = require('moment');
const base64 = require('base-64');
const cors = require('cors');
const { supabase } = require('./client'); // Import Supabase client

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL
} = process.env;

async function getTrendingItems(timeFrame) {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('item_id, count:item_id')
    .gte('timestamp', moment().subtract(timeFrame, 'seconds').toISOString())
    .group('item_id')
    .order('count', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching trending items:', error);
    throw error;
  }

  return data;
}

app.get('/api/trending', async (req, res) => {
  try {
    const trendingItems = await getTrendingItems(7 * 24 * 60 * 60); // 1 week in seconds
    res.json(trendingItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending items' });
  }
});

const generateToken = async () => {
  const credentials = base64.encode(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${credentials}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

app.post('/api/stkpush', async (req, res) => {
  const { amount, phoneNumber } = req.body;

  try {
    const token = await generateToken();

    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = base64.encode(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);

    const stkPushRequest = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: 'AccountReference',
      TransactionDesc: 'Payment for goods/services'
    };

    const { data } = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkPushRequest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (data.ResponseCode === '0') {
      // Payment successful
      res.status(200).json(data);
    } else {
      // Payment failed
      res.status(500).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    res.status(500).json({ error: 'Error initiating STK Push' });
  }
});



