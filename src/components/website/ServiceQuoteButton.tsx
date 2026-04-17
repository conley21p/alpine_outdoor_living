"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ContactModal } from "./ContactModal";

interface ServiceQuoteButtonProps {
  serviceTitle: string;
}

export function ServiceQuoteButton({ serviceTitle }: ServiceQuoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center"
      >
        <MessageSquare className="w-5 h-5" />
        Request a Quote
      </button>

      <ContactModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        serviceTitle={serviceTitle} 
      />
    </>
  );
}
