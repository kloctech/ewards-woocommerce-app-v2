import { EwardsKey } from "../../../models/index.js";
import { getText, logger } from "../../../utils/index.js";
import { AddMemberService } from "../../services/ewards/index.js";

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

    logger('00021', ewards_key._id, getText('en', '00021'), 'Info', req, 'EwardsKey');
    return res.status(200).json({
      resultMessage: { en: getText('en', '00021') },
      resultCode: '00021',
      ewards_key
    });
  } catch (err) {
    console.log('Error : ' + err.message)
    if (err.name === 'ValidationError') {
      const firstErrorField = Object.keys(err.errors)[0];
      const errorDetail = err.errors[firstErrorField];

      // Accessing `kind` and `path`
      const kind = errorDetail.kind;
      const path = errorDetail.path;

      const errorMessage = kind === 'unique' && `${path} must be unique, entered value has already been used in different store.`;

      logger('00096', '', errorMessage, 'Error', req, "EwardsKey");
      return res.status(500).json({
        resultMessage: { en: errorMessage },
        resultCode: '00096'
      });
    } else {
      logger('00096', '', getText('en', '00096'), 'Error', req, "EwardsKey");
      return res.status(500).json(errorHelper('00096', req, err.message));
    }
  }
};


