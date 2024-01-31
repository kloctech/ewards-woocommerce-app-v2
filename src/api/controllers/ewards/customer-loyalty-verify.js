import axios from 'axios';
import { loyaltyInfoVerifyApiUrl } from '../../../config/index.js';
import { Customer, EwardsKey, EwardsMerchant, WooCommerce } from "../../../models/index.js";
import { errorHelper } from '../../../utils/index.js';
import { validateLoyaltyVerify } from '../../validators/loyalty.verify.validator.js';

export default async (req, res) => {
  const body = req.body;
  const origin = req.headers.origin;

  const { error } = validateLoyaltyVerify(body);
  if (error) {
    let code = "00025";
    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  if (body.store_url !== origin) return res.status(400).json(errorHelper('00106', req));

  const customer = await Customer.findOne({ mobile: body.mobile_number, country_code: body.country_code });

  if (!customer) return res.status(400).json(errorHelper('00107', req));

  const { ewards_merchant_id } = await WooCommerce.findOne({ store_url: body.store_url });

  if (!ewards_merchant_id) return res.status(400).json(errorHelper("00018", req));

  const merchant = await EwardsMerchant.findOne({ _id: ewards_merchant_id }).catch(err => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  })

  const ewards = await EwardsKey.findOne({ ewards_merchant_id }).catch(err => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  })

  const reqHeaders = {
    "x-api-key": ewards.x_api_key
  }
  const requestBody = {
    customer_key: ewards.customer_key,
    merchant_id: merchant.merchant_id,
    mobile: body.mobile_number,
    country_code: body.country_code,
    otp: body.otp
  }

  await axios.post(loyaltyInfoVerifyApiUrl, requestBody, { headers: reqHeaders })
    .then(response => {
      return res.status(200).json(response.data)
    }).catch(err => {
      console.log({ error: err.message })
      return res.status(500).json({ error: err.message });
    })

}