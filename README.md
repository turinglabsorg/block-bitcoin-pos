# Block! A simple POS for the crypto era

Main repository of https://blockpos.xyz service. 
A simple Point of Sale Bitcoin (BTC) application.

With Block! you can set up a Bitcoin address or an XPUB, place the device in your local store and start accept Bitcoin in less than 3 minutes.

We suggest to use secure wallets like:
https://trezor.io/
https://www.ledger.com/

All the code is open source and the service will be free forever.

For a detailed explanation of the project please visit: https://blockpos.xyz/

## Features

- [x] Simple and easy to use
- [x] Open source
- [x] Free forever
- [x] Setup your own zpub or xpub
- [x] Create a new wallet on the fly and use it
- [x] Slippage protection, setup your own value
- [x] Multi-currency, choose between USDC, EUR, GBP
- [x] Public pages, show your store and accept payments
- [x] List of all transactions
- [ ] Magic link login that replaces the need of a password
- [ ] Export your transactions to a CSV file
- [ ] Customize your QR code
- [ ] Customize your public page
- [ ] Multi-language, currently only English
- [ ] Guides on how to use the app or setup your wallet

## Development of the API

To run the project locally you need to install the dependencies and run the following commands:

```bash
cd api
yarn
yarn dev:local
```

Please be sure to have your `.env` file correctly set up.

## Development of the UI

To run the project locally you need to install the dependencies and run the following commands:

```bash
cd ui
yarn
yarn dev
```

## Contributing

We welcome contributions to improve the project. Please open an issue or submit a pull request.
