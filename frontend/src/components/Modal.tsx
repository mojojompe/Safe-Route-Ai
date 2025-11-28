import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#0b2419] p-6 rounded-xl max-w-md w-full">
        {children}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-sr-green text-black py-3 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}
