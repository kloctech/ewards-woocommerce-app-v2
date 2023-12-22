import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import { dbUri } from '../config/index.js';

const { MONGODB_URI } = process.env

export default async () => {
  mongoose.set("strictQuery", false);
  console.log(MONGODB_URI);
  await mongoose.connect(MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log('Mongodb Connection');
    })
    .catch(err => {
      console.log(err);
    });
};