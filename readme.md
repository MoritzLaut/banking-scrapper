# DKB scrapper

This applications helps you exporting transactions from a DKB bank account. All transactions from all accounts will be downloaded in a seperate CSV file. This app is using puppeteer and chromium for simulating the navigations and clicks within DKB.

After the login you will be asked for accepting this login from your device!

## Getting started

### Installation

1. Install the latest version of NodeJS v12 on your system.
2. Clone this repository.
3. Run `npm i` in the project root.

### Configuration

The following settings are **required** and controlled by setting environment variables.

1. USER
2. PASS
3. FROM
4. TO

Note: please see also .env-example

### Start scrapping transactions

1. `npm run start`
2. accept 2FA from your chosen device
3. done

## Roadmap

- merge CSV files into single CSV file
- implement rule-based categorization

## Licese

MIT
