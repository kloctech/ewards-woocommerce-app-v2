import { Customer, WooCommerce } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { validateCustomer } from "../../validators/customer.validator.js";
import { AddMemberService } from "../../services/ewards/index.js";

export default async (req, res) => {
  const body = req.body;
  if (!body.id) return res.status(200).json('Customer data not found')

  if (body.id) {
    const url = body._links.self[0].href || "";
    const storeUrl = url.substring(0, url.indexOf("/wp-json")) || url;

    let wooCommerce = await WooCommerce.findOne({ store_url: storeUrl })
      .populate({
        path: 'customers',
        model: 'WooCommerceCustomer',
        match: { email: body.email, mobile: body.billing.phone, woo_customer_id: body.id }
      })
      .exec()
      .catch(err => console.log(err.message))

    if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));

    const { customers = [] } = wooCommerce;
    if (customers.length) {
      return res.status(200).json({
        resultMessage: { en: getText("en", "00114") },
        resultCode: "00114"
      });
    }

    const customerObj = {
      first_name: body.first_name,
      last_name: body.last_name,
      mobile: body.billing.phone.slice(-10),
      address: `${body.billing.address_1} - ${body.billing.address_2}`,
      city: body.billing.city,
      email: body.email,
      state: body.billing.state,
      woo_customer_id: body.id,
      woo_commerce_id: wooCommerce._id,
      country_code: "+91", // todo: different country code
    };

    const { error } = validateCustomer(customerObj);
    if (error) {
      let code = "00025";
      console.log(error.details[0].message)
      return res.status(400).json(errorHelper(code, req, error.details[0].message));
    }

    try {
      const customer = await new Customer(customerObj).save();
      wooCommerce.customers.push(customer._id)
      wooCommerce.save()

      if (customer.mobile) {
        const member = new AddMemberService(customerObj);
        member.execute();
      }

      logger("00105", customer._id, getText("en", "00105"), "Info", req, "Customer");
      return res.status(200).json({
        resultMessage: { en: getText("en", "00105") },
        resultCode: "00105",
      });
    } catch (err) {
      console.log(err.message)
      logger("00104", "", getText("en", "00104"), "Error", req, "Customer");
      return res.status(400).json({
        resultMessage: { en: getText("en", "00104") },
        resultCode: "00104",
      });
    }
  }
};
