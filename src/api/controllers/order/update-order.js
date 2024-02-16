import { errorHelper, logger, getText } from '../../../utils/index.js';
export default async (req, res) => {
    console.log(req.body);
    return res.status(200).json({
      resultMessage: { en: getText('en', '00089') },
      resultCode: '00089',
      points: req.body
    });
}