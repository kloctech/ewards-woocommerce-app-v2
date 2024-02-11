export { default as swaggerConfig } from "./swagger.config.js";
import { config } from "dotenv";
config();
//NOTE: If you are running the project in an instance, you should store these secret keys in its configuration settings.
// This type of storing secret information is only experimental and for the purpose of local running.

const { MONGODB_URI, PORT, JWT_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, BUCKET_NAME, PRODUCTION_URL, EWARDS_API_URL,POINT_REDEEM_REQUEST,CREATE_WOOCOMMERCE_CODE , EWARDS_ADD_MEMBER_API_URL, LOYALTY_INFO_REQUEST_API_URL, LOYALTY_INFO_VERIFY_API_URL} = process.env;

export const port = PORT || 3001;
export const jwtSecretKey = JWT_SECRET_KEY;
export const refreshTokenSecretKey = REFRESH_TOKEN_SECRET_KEY;
export const dbUri = MONGODB_URI;
export const awsAccessKey = AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = AWS_SECRET_ACCESS_KEY;
export const awsRegion = AWS_REGION;
export const bucketName = BUCKET_NAME;
export const prefix = "/api";
export const specs = "/docs";
export const ewardsApiUrl = EWARDS_API_URL;
export const pointRedeemRequest = POINT_REDEEM_REQUEST;
export const createCreateWoocommerceCode = CREATE_WOOCOMMERCE_CODE;
export const productionUrl = PRODUCTION_URL;
export const ewardsAddMemberApiUrl = EWARDS_ADD_MEMBER_API_URL;
export const loyaltyInfoRequestApiUrl = LOYALTY_INFO_REQUEST_API_URL;
export const loyaltyInfoVerifyApiUrl = LOYALTY_INFO_VERIFY_API_URL;
