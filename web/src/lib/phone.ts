export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("243") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+243${digits.slice(1)}`;
  }
  if (digits.length === 9) {
    return `+243${digits}`;
  }
  if (raw.startsWith("+")) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

export function isValidCongolesePhone(phone: string): boolean {
  return /^\+243[0-9]{9}$/.test(phone);
}
