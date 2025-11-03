export type SubscriptionDuration = 'ONE_WEEK' | 'ONE_MONTH' | 'ONE_YEAR';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  categoryId: string;
  subscriptionStartDate: number;
  subscriptionDuration: SubscriptionDuration;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Subscription {
  clientId: string;
  startDate: number;
  duration: SubscriptionDuration;
  expiryDate: number;
  isActive: boolean;
}

export type SortOption = 'name' | 'expiry';
