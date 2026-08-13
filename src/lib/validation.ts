export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: "card" | "cod" | "wallet";
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s-]{7,15}$/;

export function validateCheckoutForm(data: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(data.email)) errors.email = "Enter a valid email";

  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!PHONE_REGEX.test(data.phone)) errors.phone = "Enter a valid phone number";

  if (!data.address.trim()) errors.address = "Address is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.state.trim()) errors.state = "State is required";
  if (!data.postalCode.trim()) errors.postalCode = "Postal code is required";
  if (!data.country.trim()) errors.country = "Country is required";

  if (data.paymentMethod === "card") {
    if (!data.cardName.trim()) errors.cardName = "Name on card is required";
    if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Enter a valid 16-digit card number";
    }
    if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      errors.cardExpiry = "Format: MM/YY";
    }
    if (!/^\d{3,4}$/.test(data.cardCvv)) {
      errors.cardCvv = "Enter a valid CVV";
    }
  }

  return errors;
}