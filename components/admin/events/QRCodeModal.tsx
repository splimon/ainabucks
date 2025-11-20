/**
 * components/admin/events/QRCodeModal.tsx
 * Modal to display and download/print QR codes for check-in/out
 */

"use client";

import { X, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event, EventWithRegistrations } from "@/database/schema";
import { generateEventQRCodes } from "@/lib/utils/qr";

interface QRCodeModalProps {
  event: Event | EventWithRegistrations;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeModal({
  event,
  isOpen,
  onClose,
}: QRCodeModalProps) {
  if (!isOpen) return null;

  // Generate QR codes
  const qrCodes = generateEventQRCodes(
    event.id,
    event.checkInToken!,
    event.checkOutToken!,
  );

  // Download QR code as image
  const downloadQR = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print QR codes
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Event QR Codes</h2>
            <p className="text-sm text-gray-600 mt-1">{event.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="print:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* QR Codes Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-In QR Code */}
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-green-900 mb-1">
                Check-In
              </h3>
              <p className="text-sm text-green-700">
                Scan to sign in to the event
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <img
                src={qrCodes.checkIn.qrCode}
                alt="Check-in QR Code"
                className="w-full h-auto"
              />
            </div>

            {/* URL Display */}
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Check-in URL:</p>
              <div className="bg-white p-2 rounded border border-gray-200 break-all text-xs text-gray-800">
                {qrCodes.checkIn.url}
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={() =>
                downloadQR(qrCodes.checkIn.qrCode, `${event.title}-checkin.png`)
              }
              className="w-full bg-green-700 hover:bg-green-800 text-white print:hidden"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Check-In QR
            </Button>
          </div>

          {/* Check-Out QR Code */}
          <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-orange-900 mb-1">
                Check-Out
              </h3>
              <p className="text-sm text-orange-700">
                Scan to sign out of the event
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <img
                src={qrCodes.checkOut.qrCode}
                alt="Check-out QR Code"
                className="w-full h-auto"
              />
            </div>

            {/* URL Display */}
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Check-out URL:</p>
              <div className="bg-white p-2 rounded border border-gray-200 break-all text-xs text-gray-800">
                {qrCodes.checkOut.url}
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={() =>
                downloadQR(
                  qrCodes.checkOut.qrCode,
                  `${event.title}-checkout.png`,
                )
              }
              className="w-full bg-orange-700 hover:bg-orange-800 text-white print:hidden"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Check-Out QR
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-t border-blue-200 p-6 print:page-break-before">
          <h4 className="font-bold text-blue-900 mb-3">How to Use:</h4>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Print or display these QR codes at the event location</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Volunteers scan the Check-In QR when they arrive</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Volunteers scan the Check-Out QR when they leave</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>
                Review attendance and award ʻĀina Bucks in the admin panel
              </span>
            </li>
          </ol>
        </div>

        {/* Event Details for Print */}
        <div className="hidden print:block p-6 border-t border-gray-200">
          <h4 className="font-bold text-gray-900 mb-2">Event Details:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Title:</strong> {event.title}
            </p>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Time:</strong> {event.startTime} - {event.endTime}
            </p>
            <p>
              <strong>Location:</strong> {event.locationName}
            </p>
            <p>
              <strong>Reward:</strong> {event.ainaBucks} ʻĀina Bucks (
              {event.bucksPerHour}/hour)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
