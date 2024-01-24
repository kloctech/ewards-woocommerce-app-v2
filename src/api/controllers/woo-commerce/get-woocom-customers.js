import { WooCommerce, Customer } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const store_url = req.query.store_url;

  const wooCommerce = await WooCommerce.findOne({ store_url }).catch((err) => {
    return res.status(500).json(errorHelper("00018", req, err.message));
  });

  if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));

  const customers = await Customer.find({ woo_commerce_id: wooCommerce._id }).catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  return res.status(200).json({
    resultMessage: { en: getText("en", "00103") },
    resultCode: "00103",
    customers_data: customers,
  });
};
