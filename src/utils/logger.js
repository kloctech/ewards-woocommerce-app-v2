import { Log } from '../models/index.js';
import ipHelper from './helpers/ip-helper.js';

export default async (code, modelId, errorMessage, level, req,model) => {
  let ip = 'no-ip';
  if(req !== '') ip = ipHelper(req);
  let log = new Log({
    resultCode: code,
    level: level,
    errorMessage: errorMessage,
    ip: ip,
    model: model
  });

  if (modelId !== '' && modelId) log.modelId = modelId;


  await log.save()
    .catch(err => {
      console.log('Logging is failed: ' + err);
    });
}
