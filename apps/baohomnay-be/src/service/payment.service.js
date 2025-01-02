import PayOSsdk from '@payos/node';
export async function createBill(accId) {
  const payos = new PayOSsdk(
    process.env.payOSclientID,
    process.env.payOSapiKey,
    process.env.payOScheckSumKey
  );
  const body = {
    orderCode: Date.now(),
    amount: 2000,
    description: 'Verified Account',
    items: [
      {
        accId: `${accId}`,
        name: 'Verify Account',
        quantity: 1,
        price: 2000,
      },
    ],
    cancelUrl: 'http://localhost:4200/',
    returnUrl: 'http://localhost:4200/user/success',
  };
  const res = await payos.createPaymentLink(body);

  return res.checkoutUrl;
}
