import cron from 'node-cron'
import { BillRepushService } from "../api/services/ewards/index.js";

export default () => {
  // running scheduler everyday at 10AM to repush the non-settled bills
  cron.schedule('0 10 * * *', () => {
    console.log('Scheduler running for bill-repush-service');
    new BillRepushService().execute()
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
}