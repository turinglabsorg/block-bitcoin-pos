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

async function main() {
  const bip32 = BIP32Factory(ecc);

  const xpub = process.env.xpub;
  if (!xpub) {
    throw new Error("XPUB is not defined in .env");
  }

  // Create node from xpub
  const node = bip32.fromBase58(xpub);

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
