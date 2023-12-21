import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import { dbUri } from '../config/index.js';

const { DB_URL } = process.env

export default async () => {
  mongoose.set("strictQuery", false);
  console.log(DB_URL);
  await mongoose.connect(DB_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log('Mongodb Connection');
    })
    .catch(err => {
      console.log(err);
    });
};