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

// ===== Auth validation (Login/Signup) =====

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Add at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)) {
    return "Add at least one special character (!@#$%...)";
  }
  return null;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignupErrors = Partial<Record<keyof SignupFormData, string>>;

export function validateSignupForm(data: SignupFormData): SignupErrors {
  const errors: SignupErrors = {};

  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}