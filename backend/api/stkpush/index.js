import axios from 'axios';
import base64 from 'base-64';
import moment from 'moment';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
