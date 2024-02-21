import { WooCommerce, Order, Coupon } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { BillSettlementService } from '../../services/ewards/index.js'

export default async (req, res) => {
  const body = req.body;

  const couponCode = body.coupon_lines[0].code;
  const customer_id = body.customer_id;

  const url = body._links.self[0].href || "";
  const storeUrl = url.substring(0, url.indexOf("/wp-json")) || url;

  if (body.id && body.coupon_lines.length) {
    let wooCommerce = await WooCommerce.findOne({ store_url: storeUrl })
      .populate({
        path: 'ewards_key_id',
        model: 'EwardsKey',
        select: 'customer_key x_api_key',
        populate: {
          path: 'ewards_merchant_id',
          model: 'EwardsMerchant',
          select: 'merchant_id'
        }
      })
      .populate({
        path: "customers",
        model: "WooCommerceCustomer",
        match: { woo_customer_id: customer_id },
      })
      .exec()
      .catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

    if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));
    const ewardsKey = wooCommerce.ewards_key_id;
    const merchantId = ewardsKey.ewards_merchant_id.merchant_id;
    if (!ewardsKey) return res.status(400).json(errorHelper("00015", req));
    if (!merchantId) return res.status(400).json(errorHelper("00110", req));

    const coupon = await Coupon.findOne({ woo_coupon_code: couponCode }, { ewards_cart_id: 1 })
      .populate({
        path: "ewards_cart_id",
        model: "EwardsCart",
        select: 'cart_token'
      }).catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));
    const cartToken = coupon.ewards_cart_id.cart_token;

    const billSettlement = await new BillSettlementService(body, ewardsKey, merchantId, cartToken).execute();
    res.json(billSettlement);

    //   const orderObj = {
    //     woo_order_json: JSON.stringify(body),
    //     woo_order_id: body.id,
    //     gross_amount: body.total - body.total_tax,
    //     net_amount: body.total - body.discount_total,
    //     order_date_created: body.date_created,
    //     total_amount: body.total,
    //     woo_commerce_id: wooCommerce._id,
    //     discount_amount: body.discount_total,
    //     payment_method_title: body.payment_method,
    //     ewards_cart_id: coupon.ewards_cart_id,
    //   };

    //   try {
    //     const order = await new Order(orderObj).save();
    //     wooCommerce.orders.push(order._id);
    //     wooCommerce.save();

    //     logger("00126", order._id, getText("en", "00126"), "Info", req, "Order");
    //     return res.status(200).json({
    //       resultMessage: { en: getText("en", "00126") },
    //       resultCode: "00126",
    //       order,
    //     });
    //   } catch (err) {
    //     logger("00125", "", getText("en", "00125"), "Error", req, "Order");
    //     return res.status(400).json({
    //       resultMessage: { en: getText("en", "00125") },
    //       resultCode: "00125",
    //     });
    //   }
  }
};
