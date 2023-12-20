
import  swaggerAutogen from "swagger-autogen"
const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3001'
};

const outputFile = './swagger-output.json';
const routes = ['src/api/routes/index.js'];

swaggerAutogen(outputFile, routes, doc);