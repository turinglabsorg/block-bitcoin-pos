import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import b58 from "bs58check";
import axios from "axios";
import { log } from "../utils";

function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!;
}

function zpubToXpub(zpub: string) {
  // Decode the base58check string
  const data = b58.decode(zpub);

  // Verify we're actually dealing with a zpub
  const zpubVersion = Buffer.from(data.slice(0, 4)).toString("hex");
  if (zpubVersion !== "04b24746") {
    const errorMessage = `Invalid zpub version bytes: ${zpubVersion}`;
    throw new Error(errorMessage);
  }

  // Remove zpub version bytes
  const payload = data.slice(4);

  // Add xpub version bytes
  const xpubVersionBytes = Buffer.from("0488b21e", "hex");
  const xpubData = Buffer.concat([xpubVersionBytes, payload]);

  // Encode back to base58check
  return b58.encode(xpubData);
}

async function deriveAddressFromZpub(
  zpub: string,
  path: string
): Promise<string | false> {
  try {
    const bip32 = BIP32Factory(ecc);

    // Create node from xpub
    const node = bip32.fromBase58(zpubToXpub(zpub));

    // Derive child key using unhardened path
    const child = node
      .derive(parseInt(path.split("/")[0]))
      .derive(parseInt(path.split("/")[1]));

    // Get native segwit address
    const address = getAddress(child, bitcoin.networks.bitcoin);

    return address;
  } catch (e) {
    log("🚨 ERROR_DERIVE_ADDRESS_FROM_ZPUB", e);
    log("-----------------------");
    log("DEBUG_ZPUB", zpub);
    log("DEBUG_PATH", path);
    return false;
  }
}

async function deriveAddressFromXpub(
  xpub: string,
  path: string
): Promise<string | false> {
  try {
    const bip32 = BIP32Factory(ecc);

    // Create node from xpub
    const node = bip32.fromBase58(xpub);

    // Derive child key using unhardened path
    const child = node
      .derive(parseInt(path.split("/")[0]))
      .derive(parseInt(path.split("/")[1]));

    // Get native segwit address
    const address = getAddress(child, bitcoin.networks.bitcoin);
    return address;
  } catch (e) {
    log("🚨 ERROR_DERIVE_ADDRESS_FROM_XPUB", e);
    return false;
  }
}

export async function deriveAddress(
  xpub: string,
  path: string
): Promise<string | false> {
  if (xpub.indexOf("zpub") !== -1) {
    return deriveAddressFromZpub(xpub, path);
  }
  if (xpub.indexOf("xpub") !== -1) {
    return deriveAddressFromXpub(xpub, path);
  }
  return false;
}

export function isValidAddress(address: string): boolean {
  return bitcoin.address.toOutputScript(address) !== null;
}

export async function calculateAmountCrypto(
  amountFiat: number,
  currency: string,
  slippage: number
): Promise<{ price: number; amountCrypto: number } | false> {
  try {
    const price = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
    );
    const pricePerBitcoin = price.data.bitcoin[currency];
    const amountCrypto = (amountFiat / pricePerBitcoin) * (1 + slippage / 100);
    return {
      price: pricePerBitcoin,
      amountCrypto: parseFloat(amountCrypto.toFixed(8)),
    };
  } catch (e) {
    log("🚨 ERROR_CALCULATE_AMOUNT_CRYPTO", e);
    return false;
  }
}

export async function checkBitcoinPayment(
  address: string,
  onlyConfirmed: boolean
): Promise<number | false> {
  try {
    const response = await axios.get(
      `https://api.tatum.io/v3/bitcoin/address/balance/${address}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": process.env.tatum_api_key,
        },
      }
    );
    log("💰 DEBUG_BITCOIN_BALANCE", response.data);
    if (parseFloat(response.data.incoming) > 0) {
      if (onlyConfirmed) {
        log("💰 DEBUG_ONLY_CONFIRMED", onlyConfirmed);
        const amount =
          parseFloat(response.data.incoming) -
          parseFloat(response.data.incomingPending);
        log("💰 DEBUG_AMOUNT", amount);
        return amount;
      }
      return parseFloat(response.data.incoming);
    }
    return false;
  } catch (e) {
    log("🚨 ERROR_CHECK_BITCOIN_PAYMENT", e);
    return false;
  }
}
