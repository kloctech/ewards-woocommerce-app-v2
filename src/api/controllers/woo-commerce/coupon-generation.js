import { CreateCouponService } from "../../services/woo-commerce/index.js";

export default async (req, res) => {
  const body = req.body;

  const consumerKey = "ck_07edaf5a66ee10a4f9874d1481fb92668e61ed7b";
  const consumerSecret = "cs_7b44edf35a201dcfc5b64783e8baaa06fd1b108f";
  const storeUrl = "https://wordpress-698237-3804107.cloudwaysapps.com";

  try {
    const member = new CreateCouponService(consumerKey, consumerSecret, storeUrl, body.minimum_amount, body.email_restrictions, body.usage_limit, body.usage_limit_per_user, body.bill_amount, body.coupon_details, body.points, body.mobile_number, body.cart_id);

    const coupon = await member.execute();
    return res.status(200).json({ message: "Coupon created successfully", data: coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
