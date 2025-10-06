// File: src/store/api/subscriptionAPI.ts
import { apiClient } from "./ApiClient";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}

interface PaymentMethod {
  id: string;
  type: "card";
  card: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export const subscriptionAPI = {
  getPlans: () => {
    return apiClient.get("/subscriptions/plans");
  },

  getCurrentSubscription: () => {
    return apiClient.get("/subscriptions/current");
  },

  subscribe: (planId: string, paymentMethodId: string) => {
    return apiClient.post("/subscriptions/subscribe", {
      planId,
      paymentMethodId,
    });
  },

  updateSubscription: (planId: string) => {
    return apiClient.put("/subscriptions/update", { planId });
  },

  cancelSubscription: () => {
    return apiClient.post("/subscriptions/cancel");
  },

  resumeSubscription: () => {
    return apiClient.post("/subscriptions/resume");
  },

  getPaymentMethods: () => {
    return apiClient.get("/subscriptions/payment-methods");
  },

  addPaymentMethod: (paymentMethodId: string) => {
    return apiClient.post("/subscriptions/payment-methods", {
      paymentMethodId,
    });
  },

  deletePaymentMethod: (paymentMethodId: string) => {
    return apiClient.delete(
      `/subscriptions/payment-methods/${paymentMethodId}`
    );
  },

  setDefaultPaymentMethod: (paymentMethodId: string) => {
    return apiClient.put("/subscriptions/payment-methods/default", {
      paymentMethodId,
    });
  },

  getInvoices: () => {
    return apiClient.get("/subscriptions/invoices");
  },

  downloadInvoice: (invoiceId: string) => {
    return apiClient.get(`/subscriptions/invoices/${invoiceId}/download`, {
      responseType: "blob",
    });
  },

  updateBillingInfo: (billingInfo: any) => {
    return apiClient.put("/subscriptions/billing-info", billingInfo);
  },
};
