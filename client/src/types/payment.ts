/**
 * Payment & Subscription TypeScript Type Definitions
 * Connects frontend payment components and services with the backend API
 */

export type PaymentGateway = "bKash" | "Nagad" | "Card" | "Bank Transfer";

export type PaymentStatus = "completed" | "pending" | "failed";

export type BillingCycle = "monthly" | "yearly";

export type MembershipTier =
  | "Free Pass"
  | "Basic Pass"
  | "Pro Athlete"
  | "VIP Ultimate";

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

export interface MyTransactionsResponse {
  success: boolean;
  message: string;
  data?: {
    count: number;
    payments: PaymentRecord[];
  };
  error?: string;
}
