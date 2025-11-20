/**
 * lib/utils/qr.ts
 * Utility functions for QR code generation
 * Generates QR code URLs for event check-in and check-out
 * Uses free QR code API (qrserver.com) to generate QR code images
 */

/**
 * Generate QR code data URL using an external API
 * We'll use the free qrcode API from goqr.me
 */
export function generateQRCodeURL(data: string, size: number = 300): string {
  const encodedData = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
}

/**
 * Generate check-in URL for an event
 */
export function getCheckInURL(eventId: string, checkInToken: string): string {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseURL}/attendance/check-in/${eventId}?token=${checkInToken}`;
}

/**
 * Generate check-out URL for an event
 */
export function getCheckOutURL(eventId: string, checkOutToken: string): string {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseURL}/attendance/check-out/${eventId}?token=${checkOutToken}`;
}

/**
 * Generate both QR codes for an event
 */
export function generateEventQRCodes(
  eventId: string,
  checkInToken: string,
  checkOutToken: string
) {
  const checkInURL = getCheckInURL(eventId, checkInToken);
  const checkOutURL = getCheckOutURL(eventId, checkOutToken);
  
  return {
    checkIn: {
      url: checkInURL,
      qrCode: generateQRCodeURL(checkInURL),
    },
    checkOut: {
      url: checkOutURL,
      qrCode: generateQRCodeURL(checkOutURL),
    },
  };
}