import { createHash, timingSafeEqual } from "node:crypto";

export const CMI_CLIENT_ID = process.env.CMI_CLIENT_ID ?? "";
export const CMI_STORE_KEY = process.env.CMI_STORE_KEY ?? "";
export const CMI_GATEWAY_URL =
  process.env.CMI_GATEWAY_URL ?? "https://testsecure.monetico-services.com/test_payment";
export const CMI_OK_URL = `${process.env.APP_URL ?? "http://localhost:3000"}/agent/promote?status=ok`;
export const CMI_FAIL_URL = `${process.env.APP_URL ?? "http://localhost:3000"}/agent/promote?status=fail`;
export const CMI_CALLBACK_URL =
  process.env.CMI_CALLBACK_URL ??
  `${process.env.APP_URL ?? "http://localhost:3000"}/api/payments/cmi/callback`;

export interface CmiFormParams extends Record<string, string> {
  clientid: string;
  storetype: string;
  amount: string;
  oid: string;
  okUrl: string;
  failUrl: string;
  callbackUrl: string;
  cancelUrl: string;
  currency: string;
  language: string;
  rnd: string;
  hashAlgorithm: string;
  hash: string;
}

export function cmiSign(params: Record<string, string>): string {
  const data = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] != null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha512").update(`${data}&${CMI_STORE_KEY}`).digest("hex").toUpperCase();
}

export function buildCmiForm(params: CmiFormParams): CmiFormParams {
  return { ...params, hash: cmiSign(params) };
}

export function verifyCmiCallback(raw: Record<string, string>): boolean {
  const hash = raw["HASH"];
  const hashParams = raw["HASHPARAMS"];
  const hashParamsVal = raw["HASHPARAMSVAL"];
  if (!hash || !hashParams || !hashParamsVal) return false;

  const keys = hashParams.split(":");
  const values = hashParamsVal.split(":");
  if (keys.length !== values.length) return false;

  const data = keys
    .map((key, i) => `${key}=${values[i] ?? ""}`)
    .join("&");

  const computed = createHash("sha512")
    .update(`${data}&${CMI_STORE_KEY}`)
    .digest("hex")
    .toUpperCase();

  const expected = Buffer.from(hash.toUpperCase(), "utf8");
  const actual = Buffer.from(computed, "utf8");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function buildCmiAutoPostForm(params: CmiFormParams): string {
  return Object.entries(params)
    .map(([k, v]) => {
      // Escape HTML to prevent XSS
      const escapedKey = k.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedValue = v.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<input type="hidden" name="${escapedKey}" value="${escapedValue}"/>`;
    })
    .join("");
}
