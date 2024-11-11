import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import dotenv from "dotenv";
import { log } from "./utils";
dotenv.config();

const returnSecret = (key): any => {
  return new Promise(async (response) => {
    if (process.env[key] === undefined) {
      try {
        const secret_key =
          process.env.SECRET_PREFIX + "/" + process.env.STAGE + "/" + key;
        const client = new SSMClient({ region: process.env.AWS_REGION });
        const ssm = await client.send(
          new GetParameterCommand({ Name: secret_key, WithDecryption: true })
        );
        const secret = ssm?.Parameter?.Value;
        if (secret !== undefined) {
          response(secret);
        } else {
          log("🚨 ERROR_SECRET_IS_UNDEFINED");
          response(false);
        }
      } catch (e) {
        log("🚨 ERROR_DECRYPTION", e);
        response(false);
      }
    } else {
      response(process.env[key]);
    }
  });
};

export { returnSecret };
