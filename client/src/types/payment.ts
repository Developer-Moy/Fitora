
/**
 * Payment & Subscription TypeScript Type Definitions
 * Connects frontend payment components and services with the backend API
 */

/**
 * Supported payment gateways
 */
export type PaymentGateway =
  | "bKash"
  | "Nagad"
  | "Stripe"
  | "Card"
  | "Bank Transfer";

/**
 * Canonical payment status used by the frontend
 *
 * Backend Stripe status "paid" should be normalized to "completed"
 * before sending the response to the frontend.
 */
export type PaymentStatus =
  | "completed"
  | "pending"
  | "failed";

/**
 * Canonical billing cycle used across the frontend
 *
 * Backend Stripe may internally use "annual",
 * but unified API responses should return "yearly".
 */
export type BillingCycle =
  | "monthly"
  | "yearly";

/**
 * Available membership tiers
 */
export type MembershipTier =
  | "Free Pass"
  | "Basic Pass"
  | "Pro Athlete"
  | "VIP Ultimate";

/**
 * Payment checkout request payload
 */
export interface CheckoutPayload {
  planName: MembershipTier | string;
  billingCycle?: BillingCycle;
  amountBDT: number;
  gateway: PaymentGateway;
  accountNumber?: string;
  transactionId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

/**
 * Invoice information
 */
export interface PaymentInvoice {
  invoiceNumber: string;
  transactionId: string;
  planName: string;
  billingCycle: BillingCycle;
  amountBDT: number;
  gateway: PaymentGateway;
  date: string | Date;
  expiryDate: string | Date;
}

/**
 * Unified payment transaction record
 */
export interface PaymentRecord {
  _id: string;

  userId: string;

  userName?: string;
  userEmail?: string;

  planName: string;

  billingCycle: BillingCycle;

  amountBDT: number;

  gateway: PaymentGateway;

  accountNumber?: string;

  transactionId: string;

  status: PaymentStatus;

  subscriptionStartDate: string | Date;

  subscriptionExpiryDate: string | Date;

  invoiceNumber: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Checkout API response
 */
export interface CheckoutResponse {
  success: boolean;
  message: string;

  data?: {
    payment: PaymentRecord;

    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
      plan?: string;
      status?: string;

      subscriptionExpiryDate?: string | Date;

      totalPaidBDT?: number;
    };

    invoice: PaymentInvoice;
  };

  error?: string;
}

/**
 * Active subscription information
 */
export interface ActiveSubscription {
  planName: string;
  expiryDate: string | Date;
  startDate?: string | Date;

  remainingDays: number;
  remainingHours: number;

  isActive: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;

  paymentMethod?: PaymentGateway;
}

/**
 * My Transactions API response
 */
export interface MyTransactionsResponse {
  success: boolean;
  message: string;

  data?: {
    count: number;

    payments: PaymentRecord[];

    activeSubscription?: ActiveSubscription | null;
  };

  error?: string;
}
