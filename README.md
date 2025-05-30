Paypal node.js API Service

This service gets the following:
✅ It exposes endpoints that accept HTTP requests
Example routes:

GET /token → Get access token

POST /authorize → Create and authorize a PayPal order

POST /capture/:orderId → Capture a payment

GET /get-paypal-order-id?token=... → Look up an order ID from PayPal

These routes are accessible over HTTP and return structured responses (usually JSON), which is exactly how an API behaves.

✅ It separates logic (controllers) from routing
You have a paypalController.js handling business logic and a paypalRoutes.js handling routing. This is a standard API architecture.

✅ It’s stateless and modular
The service handles each request independently, and it doesn’t rely on session or user-specific server-side memory — another hallmark of a proper API.

✅ It acts as a middleware layer
Your Node.js API mediates between your application and PayPal’s REST API, abstracting away complexity and security-sensitive tasks like token handling. This is a common pattern in real-world API services.

Installation:

Create ".env" file with this:

PAYPAL_CLIENT_ID=YOUR-SANDBOX-CLIENT-ID
PAYPAL_CLIENT_SECRET=YOUR-SANDBOX-CLIENT-SECRET

Run "npm install"
Run "node index.js"
To run as pm2 service: "pm2 start index.js --name paypal-api"
