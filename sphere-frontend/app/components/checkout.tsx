import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from "../../lib/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const customer = await stripe.customers.retrieve(req.body.customer_id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: req.body.price_id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer: customer.id,
    success_url: 'http://localhost:3000',
    cancel_url: 'http://localhost:3000',
  });

  return res.status(200).json({ checkout_url: session.url });
}
