const axios = require('axios');
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
    }
  );
  return response.data.access_token;
};

exports.getPayPalToken = async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ access_token: token });
  } catch (error) {
    console.error('Token error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to retrieve token' });
  }
};

exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    // Return the entire response or just the ID depending on your needs
    res.json({
      id: response.data.id,
      status: response.data.status,
      payer: response.data.payer
    });
  } catch (error) {
    console.error('Order details error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to retrieve order details' });
  }
};

exports.authorizePayment = async (req, res) => {
  const { amount, currency = 'USD' } = req.body;

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'AUTHORIZE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount,
          }
        }],
        application_context: {
          return_url: 'https://example.com/return',
          cancel_url: 'https://example.com/cancel'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Authorization error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authorize payment' });
  }
};

exports.capturePayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Capture error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
};
