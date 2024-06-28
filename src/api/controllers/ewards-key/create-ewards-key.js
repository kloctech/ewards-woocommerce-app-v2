import { EwardsKey } from "../../../models/index.js";
import { getText, logger } from "../../../utils/index.js";
import { AddMemberService, BillRepushService } from "../../services/ewards/index.js";
import cron from 'node-cron'

export default async (req, res) => {
  const { merchant, wooCommerce } = req;
  const customers = wooCommerce.customers ?? [];

  let ewards_key = new EwardsKey(req.body)
  ewards_key.ewards_merchant_id = merchant._id
  ewards_key.woo_commerce_id = wooCommerce._id


  try {
    ewards_key = await ewards_key.save();
    wooCommerce.ewards_key_id = ewards_key._id;
    wooCommerce.save();
    merchant.ewards_keys.push(ewards_key._id);
    merchant.save();

    customers
      .filter(customer => customer.mobile)
      .forEach(customer => new AddMemberService(customer).execute());

    // running scheduler every at 10AM to repush the non-settled bills
    cron.schedule('40 10 * * *', () => {
      console.log('Scheduler running for bill-repush-service');
      new BillRepushService().execute()
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    logger('00021', ewards_key._id, getText('en', '00021'), 'Info', req, 'EwardsKey');
    return res.status(200).json({
      resultMessage: { en: getText('en', '00021') },
      resultCode: '00021',
      ewards_key
    });
  } catch (err) {
    console.log(err.response)
    logger('00096', '', getText('en', '00096'), 'Error', req, 'EwardsKey');
    return res.status(500).json({
      resultMessage: { en: getText('en', '00096') },
      resultCode: '00096'
    });
  }
};


