import type Stripe from "stripe";
import { prisma } from "../../config/prisma.js";
import { stripe } from "../../config/stripe.js";
import { ApiError } from "../../utils/ApiError.js";
import { logAction } from "../../utils/audit.js";

export const initiatePayment = async (tenantId: string, rentPaymentId: string) => {
  const rentPayment = await prisma.rentPayment.findUnique({
    where: { id: rentPaymentId },
    include: { tenancy: true },
  });
  if (!rentPayment) throw new ApiError(404, "Rent payment not found");
  if (rentPayment.tenancy.tenantId !== tenantId) throw new ApiError(403, "Not your payment");
  if (rentPayment.status === "PAID") throw new ApiError(400, "Already paid");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Rent payment - Tenancy ${rentPayment.tenancyId}` },
          unit_amount: rentPayment.amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.CLIENT_CANCEL_URL as string,
    metadata: { rentPaymentId },
  });

  await prisma.rentPayment.update({
    where: { id: rentPaymentId },
    data: { gatewayRef: session.id },
  });

  return { checkoutUrl: session.url };
};

// Stripe webhook is the source of truth for payment status; never trust the client redirect alone.
export const handleWebhookEvent = async (event: Stripe.Event) => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const rentPaymentId = session.metadata?.rentPaymentId;
    if (!rentPaymentId || session.payment_status !== "paid") return;

    const updated = await prisma.rentPayment.update({
      where: { id: rentPaymentId },
      data: { status: "PAID", paidAt: new Date() },
    });

    await logAction("system", "PAYMENT_VERIFIED", "RentPayment", rentPaymentId, { sessionId: session.id });
    return updated;
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const rentPaymentId = session.metadata?.rentPaymentId;
    if (rentPaymentId) {
      await prisma.rentPayment.update({ where: { id: rentPaymentId }, data: { status: "FAILED" } });
    }
  }
};

export const getPaymentById = async (id: string, tenantId: string) => {
  const payment = await prisma.rentPayment.findUnique({ where: { id }, include: { tenancy: true } });
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.tenancy.tenantId !== tenantId) throw new ApiError(403, "Not your payment");
  return payment;
};