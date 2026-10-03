export const Role = {
  BUYER: "BUYER",
  PRODUCER: "PRODUCER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const OrderStatus = {
  DRAFT: "DRAFT",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  PREPARING: "PREPARING",
  DELIVERED: "DELIVERED",
  CONFIRMED: "CONFIRMED",
  DISPUTE: "DISPUTE",
  REFUNDED: "REFUNDED",
  CLOSED: "CLOSED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
