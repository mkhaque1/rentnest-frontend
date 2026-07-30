export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Payment {
  id: string;
  transactionId: string;
  rentalRequestId: string;
  amount: number;
  provider: 'STRIPE' | 'SSLCOMMERZ';
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  rentalRequest?: {
    property: { title: string };
  };
}
