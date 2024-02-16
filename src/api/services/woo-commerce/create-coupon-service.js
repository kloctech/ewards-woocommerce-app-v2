import pkg from "@woocommerce/woocommerce-rest-api";
import { randomBytes } from 'crypto';
const WooCommerceRestApi = pkg.default;
import { Coupon } from "../../../models/index.js";
import { logger, getText } from "../../../utils/index.js";

export default class CreateCouponService {
  constructor(wooCommerce, minimumAmount, email, billAmount, couponDetails, points, mobileNumber, cart) {
    this.cart = cart;
    this.billAmount = billAmount;
    this.couponDetails = couponDetails;
    this.points = points;
    this.mobileNumber = mobileNumber;
    this.cartId = cart._id;
    this.minimumAmount = minimumAmount;
    this.email = email;
    this.WooCommerce = new WooCommerceRestApi({
      url: wooCommerce.store_url,
      consumerKey: wooCommerce.consumer_key,
      consumerSecret: wooCommerce.consumer_secret,
      version: "wc/v3",
      queryStringAuth: true,
    });
  }

  async execute() {
    const couponCode = await this.#createCoupon();
    return couponCode
  }

  async #createCoupon() {
    const couponCode = randomBytes(6).toString('hex').toUpperCase()

    const data = {
      code: couponCode,
      amount: this.couponDetails ? String(this.couponDetails.discount_value) : String(this.points),
      usage_limit: this.couponDetails ? this.couponDetails.use_limit : 1,
      usage_limit_per_user: 1,
      minimum_amount: this.minimumAmount,
      email_restrictions: [this.email],
      date_expires: this.couponDetails ? this.couponDetails.valid_till : undefined,
      usage_count: this.couponDetails ? this.couponDetails.actul_used : 0,
    };

    const response = await this.WooCommerce.post("coupons", data).catch((err) => {
      console.log("WooCommerce: " + err.response.data.message);
    });
    this.#saveCoupon(response.data)
    return response.data.code;
  }

  async #saveCoupon(couponData) {
    const couponObj = {
      ewards_cart_id: this.cartId,
      woo_coupon_code: couponData.code,
      ewards_coupon_code: this.couponDetails ? this.couponDetails.token_code : null,
      ewards_points: this.points,
      use_limit: this.couponDetails?.use_limit,
      actual_used: this.couponDetails?.actul_used,
      token_valid: this.couponDetails ? this.couponDetails.valid_till : "",
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
    this.cart.save();

    logger("00115", coupon._id, getText("en", "00118"), "Info", "", "Coupon");
  }
}
