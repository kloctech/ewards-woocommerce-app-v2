import { Order, Coupon, EwardsKey } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { BillSettlementService } from '../../services/ewards/index.js'

export default class BillRepushService {

  async execute() {
    const orders = await Order.find({ bill_settled: false })
      .catch((err) => console.log(err.message));

    if (orders.length)
      for (let order of orders) {
        const ewardsKey = await EwardsKey.findOne({ woo_commerce_id: order.woo_commerce_id })
          .populate({
            path: 'ewards_merchant_id',
            model: 'EwardsMerchant',
            select: 'merchant_id'
          }).exec()
          .catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

        if (!ewardsKey) return res.status(404).json(errorHelper("00015", req));

        const merchantId = ewardsKey.ewards_merchant_id.merchant_id;
        if (!merchantId) return res.status(404).json(errorHelper("00110", req));

        const couponCode = order.woo_order_json.coupon_lines[0]?.code || "";
        const coupon = await Coupon.findOne({ woo_coupon_code: couponCode }, { ewards_cart_id: 1 })
          .populate({
            path: "ewards_cart_id",
            model: "EwardsCart",
            select: 'cart_token'
          }).catch((err) => res.status(500).json(errorHelper("00000", req, err.message)));

        const cartToken = coupon?.ewards_cart_id?.cart_token || "";

        const billSettlement = await new BillSettlementService(order.woo_order_json, ewardsKey, merchantId, cartToken).execute();

        if (billSettlement?.status_code === 200) {
          console.log(`Ewards : ${billSettlement.response.message}`)
          await Order.findOneAndUpdate({ _id: order._id }, { bill_settled: true });
        }
        else console.log('Ewards : Transaction details couldn\'t captured by eWards.')
      }
  }
}