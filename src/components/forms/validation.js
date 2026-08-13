
export function required(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

export function maxLength(value, max) {
  return String(value ?? "").trim().length <= max;
}

export function isEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(value ?? "").trim());
}

export function fileSizeUnder(file, maxMb) {
  if (!file) return false;
  return file.size <= maxMb * 1024 * 1024;
}

export function hasExtension(fileName, allowedExtensions) {
  const ext = fileName.split(".").pop().toLowerCase();
  return allowedExtensions.includes(ext);
}