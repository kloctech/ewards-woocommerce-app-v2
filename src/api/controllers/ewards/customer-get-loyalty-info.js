//  POST api/ewards/customer-get-loyalty-info route in request store_url, country_code and mobile_number will be sent.
//  Validate the request body and check for the edge cases with customer's mobile number.
//  Once the request is received check the request header for the origin of the request it should match the store URL.
//  Find merchant_id, x-api-key and customer_key by store_url build request body and request header for ewards API
//  Then make an API \WooCommerceGetLoyaltyInfoRequest call to ewards from the controller itself and return the success and failure object.
//  In response send otp as '9999' {otp: 9999}

// below is the request body for Ewards api call
// {
//     "customer_key": "this will be provided by eWards", from store_url we can get woocommerce data from woocommerce model
//     "merchant_id": "this will be provided by eWards", after getting woocommerce data in that we have data ewards_merchant_id based on ewards_merchant_id we can get ewardsmerchants data from there we have merchant_id
//     "mobile": "enter customer’s 10 digit mobile number",
//     "country_code": "enter country code"
// }

import { EwardsMerchant, WooCommerce } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";

export default async (req, res) => {
  try {
    // Extract data from the request body
    const { store_url, country_code, mobile_number } = req.body;
    res.json(req.body);
    //Validate request body
    if (!country_code || !mobile_number) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Check request header for the origin of the request matching the store URL
    const requestOrigin = req.headers.origin;

    // if (requestOrigin !== store_url) {
    //   return res.status(403).json({ message: "Request origin does not match the store URL" });
    // }

    // Fetch WooCommerce data based on store_url
    const woocommerceData = await WooCommerce.findOne({ requestOrigin });
    console.log(woocommerceData);
    if (!woocommerceData) {
      return res.status(404).json({ message: "WooCommerce data not found for the provided store URL" });
    }

    // Fetch EwardsMerchant data based on _id
    const ewardsMerchantData = await EwardsMerchant.findById(woocommerceData.ewards_merchant_id);

    if (!ewardsMerchantData) {
      return res.status(404).json({ message: "EwardsMerchant data not found for the provided _id" });
    }

    // Build request body for Ewards API
    const ewardsRequestBody = {
      customer_key: ewardsMerchantData.customer_key,
      merchant_id: ewardsMerchantData.merchant_id,
      mobile: mobile_number,
      country_code,
    };

    // Build request header for Ewards API
    const ewardsRequestHeader = {
      headers: {
        "x-api-key": ewardsMerchantData.x_api_key,
      },
    };

    // Make API call to Ewards using \WooCommerceGetLoyaltyInfoRequest endpoint
    //const ewardsApiResponse = await axios.post("/WooCommerceGetLoyaltyInfoRequest", ewardsRequestBody, ewardsRequestHeader);

    // Send OTP as '9999' in the response
    //return res.status(200).json({ otp: 9999, ewardsApiResponse: ewardsApiResponse.data });
    return res.status(200).json({ otp: 9999 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
