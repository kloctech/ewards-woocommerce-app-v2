import { WooCommerce, Order, Coupon } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { BillSettlementService, BillCancelService } from '../../services/ewards/index.js'

export default async (req, res) => {
  const body = req.body;
  if (!body.id) return res.status(200).json('Order or Coupon data not found')

  const url = body._links?.self[0]?.href || "";
  const storeUrl = url.substring(0, url.indexOf("/wp-json")) || url;

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
    }).exec()
    .catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

  if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));

  const ewardsKey = wooCommerce.ewards_key_id;
  if (!ewardsKey) return res.status(404).json(errorHelper("00015", req));
  const merchantId = ewardsKey.ewards_merchant_id.merchant_id;
  if (!merchantId) return res.status(404).json(errorHelper("00110", req));

  const couponCode = body.coupon_lines[0]?.code || "";
  const coupon = await Coupon.findOne({ woo_coupon_code: couponCode }, { ewards_cart_id: 1 })
    .populate({
      path: "ewards_cart_id",
      model: "EwardsCart",
      select: 'cart_token'
    }).catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

  const cartToken = coupon?.ewards_cart_id?.cart_token || "";

  let billSettlement;
  if (body.status === 'processing') {
    billSettlement = await new BillSettlementService(body, ewardsKey, merchantId, cartToken).execute();

    if (billSettlement?.status_code === 200)
      console.log(`Ewards : ${billSettlement.response.message}`)

    else console.log('Ewards : Transaction details couldn\'t captured by eWards.')
  }

  if (body.status === 'cancelled') {
    const billCancel = await new BillCancelService(body, ewardsKey, merchantId).execute();

    if (billCancel?.errorCode === '200')
      console.log(`Ewards : Transaction details captured by eWards successfully`)

    else console.log('Ewards : Transaction details couldn\'t captured by eWards.')
  }

  const updatedOrder = {
    gross_amount: (Number(body.total) + Number(body.discount_total) - Number(body.total_tax)).toFixed(2),
    net_amount: (Number(body.total) - Number(body.total_tax)).toFixed(2),
    discount_amount: body.discount_total,
    total_amount: Number(body.total).toFixed(2),
    payment_method_title: body.payment_method,
    order_cancelled: body.status === "cancelled",
    ...(billSettlement?.status_code === 200 && { bill_settled: true })
  };

  try {
    const order = await Order.findOneAndUpdate({ woo_order_id: body.id, woo_commerce_id: wooCommerce._id }, updatedOrder, { returnDocument: "after" })

    logger("00128", order._id, getText("en", "00128"), "Info", req, "Order");
    return res.status(200).json({
      resultMessage: { en: getText("en", "00128") },
      resultCode: "00128",
      order,
    });
  } catch (err) {
    logger("00127", "", getText("en", "00127"), "Error", req, "Order");
    return res.status(500).json({
      resultMessage: { en: getText("en", "00127") },
      resultCode: "00127",
    });
  }
};
