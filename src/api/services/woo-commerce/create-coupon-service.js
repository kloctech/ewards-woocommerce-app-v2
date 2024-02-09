import pkg from "@woocommerce/woocommerce-rest-api";
import crypto from "crypto";
const WooCommerceRestApi = pkg.default;
import { Coupon } from "../../../models/index.js";
import { logger, getText } from "../../../utils/index.js";

export default class CreateCouponService {
  constructor(consumerKey, consumerSecret, url, minimumAmount, email, usageLimit, usageLimitPerUser, billAmount, couponDetails, points, mobileNumber, cartId) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.url = url;
    this.billAmount = billAmount;
    this.couponDetails = couponDetails;
    this.points = points;
    this.mobileNumber = mobileNumber;
    this.cartId = cartId;
    this.usageLimit = usageLimit;
    this.minimumAmount = minimumAmount;
    this.email = email;
    this.usageLimitPerUser = usageLimitPerUser;

    this.WooCommerce = new WooCommerceRestApi({
      url: this.url,
      consumerKey: this.consumerKey,
      consumerSecret: this.consumerSecret,
      version: "wc/v3",
      queryStringAuth: true,
    });
  }

  async execute() {
    return await this.#createCoupon();
  }

  async #generateCouponCode() {
    const combinedString = `${this.mobileNumber}-${this.billAmount}`;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    const couponCode = hash.substring(0, 9);

    return couponCode;
  }

  async #createCoupon() {
    const couponCode = await this.#generateCouponCode();

    const data = {
      code: couponCode,
      amount: this.billAmount,
      usage_limit: this.usageLimit,
      usage_limit_per_user: this.usageLimitPerUser,
      minimum_amount: this.minimumAmount,
      email_restrictions: [this.email],
      date_expires: this.couponDetails ? this.couponDetails.token_valid : undefined,
    };

    const response = await this.WooCommerce.post("coupons", data).catch((err) => {
      console.log(err.response.data.message);
    });

    if (response) {
      console.log(response.statusText);

      const couponObj = {
        ewards_cart_id: this.cartId,
        woo_coupon_code: couponCode,
        ewards_coupon_code: this.couponDetails ? this.couponDetails.ewards_coupon_code : "",
        ewards_points: this.points,
      };

      const coupon = await Coupon.create(couponObj).catch((err) => {
        console.log(err);
        logger("00093", "", getText("en", "00017"), "Error", "", "Coupon");
      });
      logger("00115", coupon._id, getText("en", "00118"), "Info", "", "coupon");
      return coupon;
    }
  }
}
