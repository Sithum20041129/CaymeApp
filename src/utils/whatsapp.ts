import { Alert, Linking, Platform } from 'react-native';
import { COMPANY_CONFIG } from '@/config/company';
import { CatalogProduct, EnquiryItem, ProductVariant } from '@/types/product';

export function formatProductEnquiryMessage(
  product: CatalogProduct,
  selectedVariant?: ProductVariant,
  quantity = 1
): string {
  const lines = [
    `Hello ${COMPANY_CONFIG.name},`,
    '',
    'I would like to enquire about the following product:',
    '',
    `Product: ${product.productCode}`,
    `Brand: ${product.brand}`,
  ];

  if (selectedVariant?.itemNo) {
    lines.push(`Selected Variant: ${selectedVariant.itemNo}`);
  }
  if (selectedVariant?.power) {
    lines.push(`Power: ${selectedVariant.power}`);
  }
  if (selectedVariant?.colorTemperature) {
    lines.push(`Colour Temperature: ${selectedVariant.colorTemperature}`);
  }

  lines.push(`Quantity: ${quantity}`);
  lines.push('');
  lines.push('Please provide more information.');
  lines.push('');
  lines.push('Thank you.');

  return lines.join('\n');
}

export function formatMultipleEnquiryMessage(items: EnquiryItem[]): string {
  const lines = [
    `Hello ${COMPANY_CONFIG.name},`,
    '',
    'I would like to enquire about the following products:',
    '',
  ];

  items.forEach((item, index) => {
    const variantLabel = item.selectedVariant?.itemNo
      ? ` (${item.selectedVariant.itemNo})`
      : '';
    lines.push(
      `${index + 1}. ${item.product.productCode}${variantLabel} — ${item.product.brand} × ${item.quantity}`
    );
  });

  lines.push('');
  lines.push('Please share availability and further details.');
  lines.push('');
  lines.push('Thank you.');

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  const phone = COMPANY_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

async function openWhatsAppWithMessage(message: string): Promise<boolean> {
  const url = buildWhatsAppUrl(message);
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen || Platform.OS === 'web') {
      await Linking.openURL(url);
      return true;
    }
    Alert.alert(
      'WhatsApp Unavailable',
      `Unable to open WhatsApp on this device. You can reach us at ${COMPANY_CONFIG.email} or visit ${COMPANY_CONFIG.websiteUrl}.`
    );
    return false;
  } catch {
    Alert.alert(
      'Could Not Open WhatsApp',
      `Please ensure WhatsApp is installed, or contact us via email at ${COMPANY_CONFIG.email}.`
    );
    return false;
  }
}

export async function openProductEnquiry(
  product: CatalogProduct,
  selectedVariant?: ProductVariant,
  quantity = 1
): Promise<boolean> {
  const message = formatProductEnquiryMessage(product, selectedVariant, quantity);
  return openWhatsAppWithMessage(message);
}

export async function openMultipleProductEnquiry(
  items: EnquiryItem[]
): Promise<boolean> {
  if (items.length === 0) return false;
  const message = formatMultipleEnquiryMessage(items);
  return openWhatsAppWithMessage(message);
}

export async function openGeneralEnquiry(subject?: string): Promise<boolean> {
  const lines = [
    `Hello ${COMPANY_CONFIG.name},`,
    '',
    subject
      ? `I would like to enquire about: ${subject}`
      : 'I would like to enquire about your lighting products and solutions.',
    '',
    'Thank you.',
  ];
  return openWhatsAppWithMessage(lines.join('\n'));
}
