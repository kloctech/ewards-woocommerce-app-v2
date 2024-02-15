import pkg from "@woocommerce/woocommerce-rest-api";
import { randomBytes } from 'crypto';
const WooCommerceRestApi = pkg.default;
import { Coupon } from "../../../models/index.js";
import { logger, getText } from "../../../utils/index.js";

export default class CreateCouponService {
  constructor(wooCommerce, body, cart) {
    this.cart = cart;
    this.billAmount = body.bill_amount;
    this.couponDetails = body.coupon_details;
    this.points = body.points;
    this.mobileNumber = body.mobile_number;
    this.cartId = cart._id;
    this.minimumAmount = body.minimum_amount;
    this.email = body.email;
    this.WooCommerce = new WooCommerceRestApi({
      url: wooCommerce.store_url,
      consumerKey: wooCommerce.consumer_key,
      consumerSecret: wooCommerce.consumer_secret,
      version: "wc/v3",
      queryStringAuth: true,
    });
  }

  async execute() {
    return await this.#createCoupon();
  }

  async #generateCouponCode() {
    const couponCode = `${this.mobileNumber}-${this.billAmount}-${randomBytes(2).toString('hex')}`;
    // const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    // const couponCode = randomBytes().toString('hex');
    // const couponCode = hash.substring(0, 9);

    return couponCode;
  }

  async #createCoupon() {
    const couponCode = await this.#generateCouponCode();

    const data = {
      code: couponCode,
      amount: this.billAmount,
      usage_limit: this.couponDetails ? this.couponDetails.usageLimit : 1,
      usage_limit_per_user: 1,
      minimum_amount: this.minimumAmount,
      email_restrictions: [this.email],
      date_expires: this.couponDetails ? this.couponDetails.token_valid : undefined,
      usage_count: this.couponDetails ? this.couponDetails.actual_used : 0,
    };

    const response = await this.WooCommerce.post("coupons", data).catch((err) => {
      console.log(err.response.data.message);
    });

    if (response) {
      const couponObj = {
        ewards_cart_id: this.cartId,
        woo_coupon_code: couponCode,
        ewards_coupon_code: this.couponDetails ? this.couponDetails.ewards_coupon_code : "",
        ewards_points: this.points,
        use_limit: this.couponDetails?.use_limit,
        actual_used: this.couponDetails?.actual_used,
        token_valid: this.couponDetails ? this.couponDetails.token_valid : "",
        name: this.couponDetails ? this.couponDetails.name : "",
        location: this.couponDetails ? this.couponDetails.location : "",
        valid_on: this.couponDetails ? this.couponDetails.valid_on : "",
        timing: this.couponDetails ? this.couponDetails.timing : "",
        terms: this.couponDetails ? this.couponDetails.terms : "",
      };

      const coupon = await Coupon.create(couponObj).catch((err) => {
        console.log(err.message);
        logger("00093", "", getText("en", "00017"), "Error", "", "Coupon");
      });
      this.cart.coupon_id = coupon._id;
      await this.cart.save();
      logger("00115", coupon._id, getText("en", "00118"), "Info", "", "Coupon");
      return coupon;
    }
  }
}
