const express = require('express');
const router = express.Router();
const {
  getPayPalToken,
  authorizePayment,
  capturePayment,
  getOrderDetails
} = require('../controllers/paypalController');

router.get('/token', getPayPalToken);
router.post('/authorize', authorizePayment);
router.post('/capture/:orderId', capturePayment);
router.get('/order/:orderId', getOrderDetails);

module.exports = router;
