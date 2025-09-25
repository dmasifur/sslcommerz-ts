# SSLCommerz-TS (`@dmasifur/sslcommerz-ts`)

**This is a modern, TypeScript-first rewrite of the official `sslcommerz-nodejs` library.**

This version provides full type safety, a promise-based API using `async/await`, robust error handling, and a much-improved developer experience.



# SSLCommerz for Node.js (TypeScript)

**This is a modern, TypeScript-first rewrite of the official `sslcommerz-nodejs` library.**

*Special thanks to the original authors at [sslcommerz/SSLCommerz-NodeJS](https://github.com/sslcommerz/SSLCommerz-NodeJS).*

[![npm version](https://img.shields.io/npm/v/@dmasifur/sslcommerz-ts.svg)](https://www.npmjs.com/package/@dmasifur/sslcommerz-ts)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, lightweight, and fully-typed TypeScript wrapper for the SSLCommerz payment gateway. This library simplifies integration with a clean, promise-based API and strong type safety, allowing you to build reliable payment flows with confidence.

## Features

- ✅ **Modern API:** Uses `async/await` for clean, readable code.
- ✅ **Fully Typed:** Written in TypeScript for excellent autocompletion and compile-time safety.
- ✅ **Lightweight:** Minimal dependencies to keep your project lean.
- ✅ **Promise-Based:** No legacy callback-based code.
- ✅ **Comprehensive:** Covers common SSLCommerz APIs including Payment Initialization, Validation, Refunds, and Transaction Queries.

## Installation

```bash
# Using npm
npm install @dmasifur/sslcommerz-ts

# Using pnpm
pnpm add @dmasifur/sslcommerz-ts

# Using yarn
yarn add @dmasifur/sslcommerz-ts
```

## Quick Start: Usage Recipes

Here are complete, runnable examples for both TypeScript and JavaScript to get you started in minutes.

---

### 📜 TypeScript (ESM) Recipe

This example shows how to use the library in a modern TypeScript project with ES Modules.

**1. Install Dependencies:**
```bash
npm install @dmasifur/sslcommerz-ts express dotenv
npm install -D typescript ts-node @types/express @types/node
```

**2. Configure `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**3. Set up your env variables (`.env`):**


```bash
// .env

STORE_ID=
STORE_PASSWORD=

```

**4. Set up your server (`index.ts`):**

```ts
// index.ts

import 'dotenv/config';
import express from 'express';
import { SslCommerzPayment, } from '@dmasifur/sslcommerz-ts';
import type {PaymentData,} from '@dmasifur/sslcommerz-ts'


const app = express();
const port = 3000;



app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send(`
    <h1>SSLCommerz NodeJS TypeScript Library</h1>
    <p>Click the button to start a test payment.</p>
    <form action="/init" method="post">
      <button type="submit">Pay 10 BDT</button>
    </form>
  `);
});

const store_id = process.env.STORE_ID!;
const store_passwd = process.env.STORE_PASSWORD!;
const is_live = false; // false for sandbox

console.log(store_id,store_passwd)
const sslCommerzPayment = new SslCommerzPayment(store_id, store_passwd, is_live);


app.post('/init', async (req, res) => {
  console.log('-> [/init] Received payment initiation request');

  const data: PaymentData = {
    total_amount: 10,
    currency: 'BDT',
    tran_id: 'TEST' + new Date().getTime(),
    success_url: `http://localhost:${port}/success`,
    fail_url: `http://localhost:${port}/fail`,
    cancel_url: `http://localhost:${port}/cancel`,
    ipn_url: `http://localhost:${port}/ipn`,
    shipping_method: 'N/A',
    product_name: 'Test Product',
    product_category: 'General',
    product_profile: 'general',
    cus_name: 'Test Customer',
    cus_email: 'test@example.com',
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    num_of_item: 1,
    ship_name:'test_ship',
    ship_add1:'ship_addr',
    ship_city:'ship_city',
    ship_postcode:'1111',
    ship_country:'ship_country'
  };

  try {
    const apiResponse = await sslCommerzPayment.init(data);
    //console.log(apiResponse)
    if (apiResponse.GatewayPageURL) {
      console.log('--> Redirecting to:', apiResponse.GatewayPageURL);
      res.redirect(apiResponse.GatewayPageURL);
    } else {
      res.status(500).send('Failed to get Gateway Page URL.');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

app.post('/success', async (req, res) => {

  try {
    const validation = await sslCommerzPayment.validate(req.body.val_id);
    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      res.status(200).send(`
        <h1>Payment Successful!</h1>
        <p>Transaction ID: ${req.body.tran_id}</p>
        <p>Validation Status: ${validation.status}</p>
      `);
    } else {
      res.status(400).send(`
        <h1>Payment Successful, but Validation Failed!</h1>
        <p>Transaction ID: ${req.body.tran_id}</p>
      `);
    }
  } catch (error) {
    res.status(500).send(`Error during validation: ${error}`);
  }
});

app.post('/fail', (req, res) => {
  console.log('-> [/fail] Payment failed');
  res.status(200).send('<h1>Payment Failed!</h1>');
});

app.post('/cancel', (req, res) => {
  console.log('-> [/cancel] Payment cancelled');
  res.status(200).send('<h1>Payment Cancelled!</h1>');
});

// The IPN listener is crucial for confirming transactions that might have been interrupted
app.post('/ipn', (req, res) => {
  console.log('-> [/ipn] Received IPN notification');
  console.log('   IPN Body:', req.body);
  // Here you would typically validate the IPN data and update your database
  // For this example, we'll just acknowledge it
  res.status(200).send('IPN Received');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`Visit http://localhost:${port} to start`);
});

```

**5. Run your server (`index.ts`):**

```bash
  npx ts-node index.ts
```




### 📜 JavaScript (CommonJS) Recipe

This example shows how to use the library in a traditional Node.js project with CommonJS (`require`).

**1. Install Dependencies:**
```bash
npm install @dmasifur/sslcommerz-ts express dotenv
```

```bash
// .env

STORE_ID=
STORE_PASSWORD=

```

**2. Set up your server (`index.js`):**

```js
// index.js

require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;


const {SslCommerzPayment} = require('@dmasifur/sslcommerz-ts')


app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send(`
    <h1>SSLCommerz NodeJS TypeScript Library</h1>
    <p>Click the button to start a test payment.</p>
    <form action="/init" method="post">
      <button type="submit">Pay 10 BDT</button>
    </form>
  `);
});

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // false for sandbox

const sslCommerzPayment = new SslCommerzPayment(store_id, store_passwd, is_live);


app.post('/init', async (req, res) => {

  const data = {
    total_amount: 10,
    currency: 'BDT',
    tran_id: 'TEST' + new Date().getTime(),
    success_url: `http://localhost:${port}/success`,
    fail_url: `http://localhost:${port}/fail`,
    cancel_url: `http://localhost:${port}/cancel`,
    ipn_url: `http://localhost:${port}/ipn`,
    shipping_method: 'N/A',
    product_name: 'Test Product',
    product_category: 'General',
    product_profile: 'general',
    cus_name: 'Test Customer',
    cus_email: 'test@example.com',
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    num_of_item: 1,
    ship_name:'test_ship',
    ship_add1:'ship_addr',
    ship_city:'ship_city',
    ship_postcode:'1111',
    ship_country:'ship_country'
  };

  try {
    const apiResponse = await sslCommerzPayment.init(data);

    if (apiResponse.GatewayPageURL) {
      console.log('--> Redirecting to:', apiResponse.GatewayPageURL);
      res.redirect(apiResponse.GatewayPageURL);
    } else {
      res.status(500).send('Failed to get Gateway Page URL.');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.post('/success', async (req, res) => {

  try {
    const validation = await sslCommerzPayment.validate(req.body.val_id);
    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      res.status(200).send(`
        <h1>Payment Successful!</h1>
        <p>Transaction ID: ${req.body.tran_id}</p>
        <p>Validation Status: ${validation.status}</p>
      `);
    } else {
      res.status(400).send(`
        <h1>Payment Successful, but Validation Failed!</h1>
        <p>Transaction ID: ${req.body.tran_id}</p>
      `);
    }
  } catch (error) {
     res.status(500).send(`Error during validation: ${error.message}`);
  }
});

app.post('/fail', (req, res) => {
  console.log('-> [/fail] Payment failed');
  res.status(200).send('<h1>Payment Failed!</h1>');
});

app.post('/cancel', (req, res) => {
  console.log('-> [/cancel] Payment cancelled');
  res.status(200).send('<h1>Payment Cancelled!</h1>');
});

// The IPN listener is crucial for confirming transactions that might have been interrupted
app.post('/ipn', (req, res) => {
  console.log('-> [/ipn] Received IPN notification');
  console.log('   IPN Body:', req.body);
  // Here you would typically validate the IPN data and update your database
  // For this example, we'll just acknowledge it
  res.status(200).send('IPN Received');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`Visit http://localhost:${port} to start`);
});

```

**4. Run your server (`index.js`):**

```bash
  node index.js
```


## API Reference

### `new SslCommerzPayment(store_id, store_passwd, is_live)`
Creates a new client instance.
- `store_id` (string): Your store ID.
- `store_passwd` (string): Your store password.
- `is_live` (boolean): `false` for Sandbox, `true` for Live. Defaults to `false`.

### `init(data: PaymentData): Promise<InitResponse>`
Initiates a new payment session. Returns a promise that resolves with the session details, including the `GatewayPageURL`.

### `validate(val_id: string): Promise<ValidationResponse>`
Validates a transaction after the user returns to your `success_url`.

### `initiateRefund(data: RefundInitiateData): Promise<RefundResponse>`
Initiates a refund for a completed transaction.


## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License


This project is licensed under the MIT License.
