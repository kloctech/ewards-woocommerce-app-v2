
import swaggerAutogen from "swagger-autogen"
const doc = {
  info: {
    title: 'Kloc-Ewards',
    description: 'Description',
  },
  host: 'localhost:3001/api/ewards-key',
  tags: [
    { name: 'ewards-key', description: 'all ewards-key APIs' }
  ],
  paths: {}, // Will be populated by `swagger-autogen`
};

const outputFile = './swagger-output.json';
const routes = ['src/api/routes/ewards-key.js'];

swaggerAutogen(outputFile, routes, doc);