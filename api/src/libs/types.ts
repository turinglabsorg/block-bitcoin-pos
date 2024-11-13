import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  Base64URLString,
  PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/types";

export interface CreateUserBody {
  email: string;
}

export interface LoginUserBody {
  email: string;
  token: string;
}

export interface EditUserBody {
  email: string;
  xpub: string;
  username?: string;
  basePath?: string;
  slippage?: number;
  currency?: string;
  onlyConfirmed?: boolean;
  metadata?: object;
}

export interface CreateRequestBody {
  chain: AllowedChains;
  network: AllowedNetworks;
  amount: number;
  identifier?: string;
  username?: string;
}

export enum AllowedChains {
  BITCOIN = "bitcoin",
}

export enum AllowedNetworks {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export enum RequestStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  PARTIAL = "partial",
  EXPIRED = "expired",
}

export interface Passkey {
  id: Base64URLString;
  publicKey: Uint8Array;
  webAuthnUserID: Base64URLString;
  counter: number;
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
}

export const validateChain = (chain: string): boolean => {
  return Object.values(AllowedChains).includes(chain as AllowedChains);
};

export const validateNetwork = (network: string): boolean => {
  return Object.values(AllowedNetworks).includes(network as AllowedNetworks);
};
