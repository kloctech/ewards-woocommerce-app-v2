import { CreateCouponService } from "../../services/woo-commerce/index.js";

export default async (req, res) => {
  const body = req.body;

  const wooCommerce = {
    consumer_key: "ck_07edaf5a66ee10a4f9874d1481fb92668e61ed7b",
    consumer_secret: "cs_7b44edf35a201dcfc5b64783e8baaa06fd1b108f",
    store_url: "https://wordpress-698237-3804107.cloudwaysapps.com",
  };

  const cart = {
    _id: "65c9e53dec61565eed04aafb",
  };

  try {
    const member = new CreateCouponService(wooCommerce, body, cart);

    const wooCommerceResponse = await member.execute();
    return res.status(200).json({ message: "Coupon created successfully", data: wooCommerceResponse });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
