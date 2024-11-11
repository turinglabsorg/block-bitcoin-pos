import * as bip39 from "bip39";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import dotenv from "dotenv";
import * as bitcoin from "bitcoinjs-lib";
import b58 from "bs58check";
dotenv.config({ path: "./cli/.env" });

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

async function main() {
  const bip32 = BIP32Factory(ecc);

  const zpub = process.env.zpub;
  if (!zpub) {
    throw new Error("ZPUB is not defined in .env");
  }

  // Create node from xpub
  const node = bip32.fromBase58(zpubToXpub(zpub));

  // Use unhardened derivation (no apostrophes)
  let path = "0/0"; // First receiving address
  if (process.argv[2]) {
    path = process.argv[2];
  }

  // Derive child key using unhardened path
  const child = node
    .derive(parseInt(path.split("/")[0]))
    .derive(parseInt(path.split("/")[1]));

  // Get native segwit address
  const address = getAddress(child, bitcoin.networks.bitcoin);

  console.log(`Path: ${path}`);
  console.log(`Address: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
