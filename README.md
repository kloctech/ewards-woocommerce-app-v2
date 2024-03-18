# ewards WooCommerce Backend

## Introduction

### `ewards WooCommerce Backend`

This backend Node.js application serves as the server-side component for the eWards WooCommerce integration. It provides APIs for user authentication, coupon redemption, and managing eWards settings in the WooCommerce plugin.

## Features

- User authentication and authorization for secure access to the application.
- APIs for verifying users and redeeming points or available coupons.
- CRUD operations for managing eWards settings in the WooCommerce plugin.
- Integration with MongoDB database for storing user data and application settings.

## Installation

To install and run this application locally, follow these steps:

1. Clone this [repository](https://github.com/kloctech/ewards-woocommerce-app-v2) to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install all dependencies required for running this application.

### Dependencies

- aws-sdk
- axios
- bcryptjs
- body-parser
- compression
- cors
- dotenv
- express
- geoip-lite
- helmet
- joi
- jsonwebtoken
- mongoose
- mongoose-unique-validator
- morgan
- multer
- nodemailer
- nodemon
- randomstring
- rate-limiter-flexible
- swagger-jsdoc
- swagger-ui-express

### Environment Variables

Before running the application, you need to create an environment file (`.env`) by referring to sample env file and add the following variables:

- `PORT`:
- `MONGODB_URI`:
- `JWT_SECRET_KEY`:
- `PRODUCTION_URL` :
- `REFRESH_TOKEN_SECRET_KEY`:
- `EWARDS_ADD_MEMBER_API_URL`:
- `LOYALTY_INFO_REQUEST_API_URL`:
- `LOYALTY_INFO_VERIFY_API_URL` :
- `COUPON_REDEEM_REQUEST`:
- `POINT_REDEEM_REQUEST`:
- `CREATE_WOOCOMMERCE_CODE`:
- `FRONTEND_APP_URL`:

## Ngrok Configuration

Few components of this application do not work on localhost. Hence, NGROK is required.
Please go through NGROK documentation if you're not familiar with the program.Follow these steps:

1. Download Ngrok from the [official website](https://ngrok.com/download) and place the executable file in a convenient location on your system.

2. Run Ngrok in your terminal or command prompt by executing the following command (replace `/ngrok-download-path/` with the actual path where you downloaded Ngrok):

Let NGROK listen to localhost:3001 because that's the port on which nodejs server runs.

## API Documentation

For detailed documentation on the available APIs and their usage, refer to the API documentation provided in the `docs` directory.

## Technologies Used

- Node.js: JavaScript runtime environment for executing server-side code.
- Express.js: Web application framework for building APIs.
- MongoDB: NoSQL database for storing user data and application settings.
- Mongoose: MongoDB object modeling tool for Node.js.
- JSON Web Tokens (JWT): For user authentication and authorization.
