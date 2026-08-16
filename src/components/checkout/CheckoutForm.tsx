"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { validateCheckoutForm, type CheckoutFormData, type CheckoutErrors } from "@/lib/validation";
import type { DeliveryMethod, Order } from "@/types";
import { Truck, Zap, CreditCard, Banknote, Wallet } from "lucide-react";

const initialFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  paymentMethod: "card",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardName: "",
};

const SHIPPING_COST: Record<DeliveryMethod, number> = {
  standard: 5.99,
  express: 14.99,
};

const TAX_RATE = 0.08;

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-card px-3 py-2 text-sm text-text outline-none transition-colors ${
    hasError ? "border-error" : "border-muted/20 focus:border-secondary"
  }`;
}

export function CheckoutForm({
  deliveryMethod,
  onDeliveryChange,
}: {
  deliveryMethod: DeliveryMethod;
  onDeliveryChange: (method: DeliveryMethod) => void;
}) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);

  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof CheckoutFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateCheckoutForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    const shippingCost = SHIPPING_COST[deliveryMethod];
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shippingCost + tax;

    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })),
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      deliveryMethod,
      paymentMethod: formData.paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      status: "Processing",
    };

    addOrder(order);
    clearCart();
    router.push(`/orders/${order.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-text">Customer Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">First Name</label>
            <input
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={inputClass(!!errors.firstName)}
            />
            {errors.firstName && <p className="mt-1 text-xs text-error">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Last Name</label>
            <input
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={inputClass(!!errors.lastName)}
            />
            {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass(!!errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Phone</label>
            <input
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-text">Shipping Address</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted">Address</label>
            <input
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={inputClass(!!errors.address)}
            />
            {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">City</label>
            <input
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={inputClass(!!errors.city)}
            />
            {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">State</label>
            <input
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              className={inputClass(!!errors.state)}
            />
            {errors.state && <p className="mt-1 text-xs text-error">{errors.state}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Postal Code</label>
            <input
              value={formData.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              className={inputClass(!!errors.postalCode)}
            />
            {errors.postalCode && <p className="mt-1 text-xs text-error">{errors.postalCode}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Country</label>
            <input
              value={formData.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClass(!!errors.country)}
            />
            {errors.country && <p className="mt-1 text-xs text-error">{errors.country}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-text">Delivery Method</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onDeliveryChange("standard")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
              deliveryMethod === "standard"
                ? "border-secondary bg-secondary/10"
                : "border-muted/20 hover:border-text"
            }`}
          >
            <Truck className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-semibold text-text">Standard — $5.99</p>
              <p className="text-xs text-muted">5–7 business days</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onDeliveryChange("express")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
              deliveryMethod === "express"
                ? "border-secondary bg-secondary/10"
                : "border-muted/20 hover:border-text"
            }`}
          >
            <Zap className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-semibold text-text">Express — $14.99</p>
              <p className="text-xs text-muted">1–2 Business Days</p>
            </div>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-text">Payment Method</h2>
        <p className="mt-1 text-xs text-muted">
          Demo checkout only — no real payment will be Processed.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { value: "card", label: "Credit / Debit Card", icon: CreditCard },
            { value: "cod", label: "Cash on Delivery", icon: Banknote },
            { value: "wallet", label: "Digital Wallet", icon: Wallet },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateField("paymentMethod", value)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                formData.paymentMethod === value
                  ? "border-secondary bg-secondary/10"
                  : "border-muted/20 hover:border-text"
              }`}
            >
              <Icon className="h-5 w-5 text-secondary" />
              <span className="text-xs font-medium text-text">{label}</span>
            </button>
          ))}
        </div>

        {formData.paymentMethod === "card" && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Name on Card</label>
              <input
                value={formData.cardName}
                onChange={(e) => updateField("cardName", e.target.value)}
                className={inputClass(!!errors.cardName)}
              />
              {errors.cardName && <p className="mt-1 text-xs text-error">{errors.cardName}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Card Number</label>
              <input
                value={formData.cardNumber}
                onChange={(e) => updateField("cardNumber", e.target.value)}
                placeholder="1234 5678 9012 3456"
                className={inputClass(!!errors.cardNumber)}
              />
              {errors.cardNumber && <p className="mt-1 text-xs text-error">{errors.cardNumber}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Expiry (MM/YY)</label>
              <input
                value={formData.cardExpiry}
                onChange={(e) => updateField("cardExpiry", e.target.value)}
                placeholder="12/28"
                className={inputClass(!!errors.cardExpiry)}
              />
              {errors.cardExpiry && <p className="mt-1 text-xs text-error">{errors.cardExpiry}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">CVV</label>
              <input
                value={formData.cardCvv}
                onChange={(e) => updateField("cardCvv", e.target.value)}
                placeholder="123"
                className={inputClass(!!errors.cardCvv)}
              />
              {errors.cardCvv && <p className="mt-1 text-xs text-error">{errors.cardCvv}</p>}
            </div>
          </div>
        )}
      </section>

      <button
        type="submit"
        disabled={submitting || items.length === 0}
        className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}