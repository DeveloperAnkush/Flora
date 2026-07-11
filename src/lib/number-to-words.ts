const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigit(n: number): string {
  if (n < 20) return ones[n];
  return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`;
}

function threeDigit(n: number): string {
  if (n === 0) return "";
  if (n < 100) return twoDigit(n);
  return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${twoDigit(n % 100)}` : ""}`;
}

/** Convert a number to Indian English words (supports up to crores) */
function numberToWords(n: number): string {
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigit(crore)} Crore`);
  if (lakh) parts.push(`${threeDigit(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigit(thousand)} Thousand`);
  if (hundred) parts.push(threeDigit(hundred));

  return parts.join(" ");
}

/** Convert rupee amount to words e.g. "Five Hundred Eighty Rupees and Forty Paise Only" */
export function amountToWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = numberToWords(rupees);
  result += rupees === 1 ? " Rupee" : " Rupees";

  if (paise > 0) {
    result += ` and ${numberToWords(paise)} ${paise === 1 ? "Paise" : "Paise"}`;
  }

  return `${result} Only`;
}
