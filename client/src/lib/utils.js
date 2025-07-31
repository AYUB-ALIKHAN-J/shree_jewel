import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Tax and shipping constants
export const TAX_RATE = 0.05; // 5% tax
export const SHIPPING_CHARGES_INDIA = 0; // Free shipping for India
export const SHIPPING_CHARGES_INTERNATIONAL = 3000; // Rs 3000 for other countries

// Calculate shipping charges based on country
export function calculateShippingCharges(country) {
  if (!country) return null; // Loading state
  return country.toLowerCase() === 'india' ? SHIPPING_CHARGES_INDIA : SHIPPING_CHARGES_INTERNATIONAL;
}

// Calculate price with tax
export function calculatePriceWithTax(price) {
  return price * (1 + TAX_RATE);
}

// Calculate tax amount
export function calculateTaxAmount(price) {
  return price * TAX_RATE;
}

// Calculate total with tax and shipping
export function calculateTotalWithTaxAndShipping(subtotal, country) {
  const taxAmount = calculateTaxAmount(subtotal);
  const shippingCharges = calculateShippingCharges(country);
  
  if (shippingCharges === null) {
    return null; // Loading state
  }
  
  return subtotal + taxAmount + shippingCharges;
}

// Format price with tax display
export function formatPriceWithTax(price) {
  const priceWithTax = calculatePriceWithTax(price);
  return {
    originalPrice: price,
    priceWithTax: priceWithTax,
    taxAmount: calculateTaxAmount(price),
    displayPrice: priceWithTax.toFixed(2)
  };
}

// Get tax display text based on state
export function getTaxDisplayText(state) {
  if (state && state.toLowerCase() === 'tamilnadu') {
    return "Tax 5% (GST: SGST:2.5% + CGST:2.5%)";
  } else {
    return "Tax 5% (IGST)";
  }
}
