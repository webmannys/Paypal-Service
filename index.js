require('dotenv').config();
const express = require('express');
const app = express();
const paypalRoutes = require('./routes/paypalRoutes');

const port = 3000;
app.use(express.json()); // Important for reading JSON body

app.use('/paypal', paypalRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`PayPal Service running at http://0.0.0.0:${port}`);
});

