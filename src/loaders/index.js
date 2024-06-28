import mongooseLoader from './mongoose.js';
import expressLoader from './express.js';
import billRepushScheduler from './bill-repush-scheduler.js';

export default async (app) => {
  await mongooseLoader();
  expressLoader(app);
  billRepushScheduler();
}