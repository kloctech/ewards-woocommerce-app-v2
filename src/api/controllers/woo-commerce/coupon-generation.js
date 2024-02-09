import { CreateCouponService } from "../../services/woo-commerce/index.js";

export default async (req, res) => {
  const body = req.body;

  const consumerKey = "ck_586c5dc474197573700f74cba2ebedfe3fce009f";
  const consumerSecret = "cs_2473b1352f4112e873b1c2650ff28db92fce868a";
  const storeUrl = "http://kloc-commerce.local";

  try {
    const member = new CreateCouponService(consumerKey, consumerSecret, storeUrl, body.minimum_amount, body.email_restrictions, body.usage_limit, body.usage_limit_per_user, body.bill_amount, body.coupon_details, body.points, body.mobile_number, body.cart_id);

    const coupon = await member.execute();
    return res.status(200).json({ message: "Coupon created successfully", data: coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
