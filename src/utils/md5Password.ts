import { MD5 } from "crypto-js";

import getTimestamp from "./getTimestamp";

export const md5Password = (password: string) => (
  MD5(`${password}_${getTimestamp()}`).toString()
);