import mongoose from 'mongoose';

import { dbUri } from '../config/index.js';

const { MONGODB_URL } = process.env

export default async () => {
  mongoose.set("strictQuery", false);
  console.log(MONGODB_URL);
  await mongoose.connect(MONGODB_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log('Mongodb Connection');
    })
    .catch(err => {
      console.log(err);
    });
};