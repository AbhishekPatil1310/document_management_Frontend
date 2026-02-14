export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 64) return "Password must be at most 64 characters";
  return "";
};
