import { WooCommerce } from "../../../models/index.js";
import { logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  const store_url = req.query['user_id'];
  const success = req.query['success']
  let body = {is_installed: true}
  console.log(req.query)
  if (success === "1") {
    let woo_commerce =  await WooCommerce.findOneAndUpdate({ store_url: store_url },body)
      .catch((err) => {
        return res.status(500).json(errorHelper('00041', req, err.message));
      }); 
    logger('00007', woo_commerce._id , getText('en', '00007'), 'Info', req,"WooCommerce");
    res.redirect(store_url+'/wp-admin/admin.php?page=ewards-settings')
  } else {
    logger('00008', 400 , getText('en', '00008'), 'Info', req,"WooCommerce");
    res.send({ access: "Denied", success: success });
  }
};