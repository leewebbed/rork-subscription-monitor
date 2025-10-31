import { SubscriptionDuration } from '@/types';

const calculateExpiryDate = (startDate: number, duration: SubscriptionDuration): number => {
  const start = new Date(startDate);
  
  switch (duration) {
    case 'ONE_WEEK':
      return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();
    case 'ONE_MONTH':
      const oneMonthLater = new Date(start);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      return oneMonthLater.getTime();
    case 'ONE_YEAR':
      const oneYearLater = new Date(start);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return oneYearLater.getTime();
    default:
      return start.getTime();
  }
};



export const getExpiryDate = (startDate: number, duration: SubscriptionDuration): Date => {
  return new Date(calculateExpiryDate(startDate, duration));
};

export const getDaysUntilExpiry = (startDate: number, duration: SubscriptionDuration): number => {
  const expiryDate = calculateExpiryDate(startDate, duration);
  const now = Date.now();
  const diffMs = expiryDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isExpired = (startDate: number, duration: SubscriptionDuration): boolean => {
  const expiryDate = calculateExpiryDate(startDate, duration);
  return Date.now() > expiryDate;
};
