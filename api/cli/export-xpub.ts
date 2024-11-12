import * as bip39 from "bip39";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import dotenv from "dotenv";

dotenv.config({ path: "./cli/.env" });

async function main() {
  const bip32 = BIP32Factory(ecc);
  const mnemonic = process.env.mnemonic;
  if (!mnemonic) {
    throw new Error("Mnemonic is not defined in .env");
  }
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  const path = `m/84'/0'/0'`;
  const node = root.derivePath(path);
  const xpub = node.neutered().toBase58();

  console.log(xpub);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
