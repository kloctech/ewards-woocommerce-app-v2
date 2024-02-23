import { WooCommerce, Order, Coupon } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";

export default async (req, res) => {
  const body = req.body;
  if (!body.id || !body.coupon_lines.length) return res.status(200).json('Order or Coupon data not found')

  const url = body._links.self[0].href || "";
  const storeUrl = url.substring(0, url.indexOf("/wp-json")) || url;

  let wooCommerce = await WooCommerce.findOne({ store_url: storeUrl }).catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

  if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));

  const couponCode = body.coupon_lines[0].code || '';
  const coupon = await Coupon.findOne({ woo_coupon_code: couponCode }, { ewards_cart_id: 1 })
    .populate({
      path: "ewards_cart_id",
      model: "EwardsCart",
      select: 'cart_token'
    }).catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

  const orderObj = {
    woo_order_json: body,
    woo_order_id: body.id,
    gross_amount: Number(body.total) + Number(body.discount_total),
    net_amount: body.total,
    discount_amount: body.discount_total,
    total_amount: Number(body.total) + Number(body.discount_total) + Number(body.total_tax),
    order_date_created: body.date_created,
    woo_commerce_id: wooCommerce._id,
    payment_method_title: body.payment_method,
    ewards_cart_id: coupon?.ewards_cart_id._id,
  };

  try {
    const order = await new Order(orderObj).save();
    wooCommerce.orders.push(order._id);
    wooCommerce.save();

    logger("00126", order._id, getText("en", "00126"), "Info", req, "Order");
    return res.status(200).json({
      resultMessage: { en: getText("en", "00126") },
      resultCode: "00126",
      order,
    });
  } catch (err) {
    logger("00125", "", getText("en", "00125"), "Error", req, "Order");
    return res.status(500).json({
      resultMessage: { en: getText("en", "00125") },
      resultCode: "00125",
    });
  }
};
