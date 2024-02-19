import { WooCommerce, Order } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";

export default async (req, res) => {
  const body = req.body;

  const url = body._links?.self[0]?.href || "";
  const storeUrl = url.substring(0, url.indexOf("/wp-json")) || url;

  if (body.id) {
    const wooCommerce = await WooCommerce.findOne({ store_url: storeUrl });

    if (!wooCommerce) {
      return res.status(404).json(errorHelper("00018", req));
    }

    const updatedOrder = {
      woo_order_id: body.id,
      gross_amount: body.total - body.total_tax,
      net_amount: body.total - body.discount_total,
      order_date_created: body.date_created,
      total_amount: body.total,
      woo_commerce_id: wooCommerce._id,
      discount_amount: body.discount_total,
      payment_method_title: body.payment_method,
      order_cancelled: body.status === "cancelled",
    };
    try {
      const order = await Order.findOneAndUpdate({ woo_order_id: body.id, woo_commerce_id: wooCommerce._id }, updatedOrder, { returnDocument: "after" }).catch((err) => {
        logger("00125", "", getText("en", "00125"), "Error", req, "Customer");
        return res.status(500).json(errorHelper("00125", req, err.message));
      });

      console.log(order);

      logger("00126", order._id, getText("en", "00126"), "Info", req, "Order");
      return res.status(200).json({
        resultMessage: { en: getText("en", "00126") },
        resultCode: "00126",
        order,
      });
    } catch (err) {
      logger("00125", "", getText("en", "00125"), "Error", req, "Order");
      return res.status(400).json({
        resultMessage: { en: getText("en", "00125") },
        resultCode: "00125",
      });
    }
  }
};
