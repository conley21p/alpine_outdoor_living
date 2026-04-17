"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { useEffect } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
}

export function ContactModal({ isOpen, onClose, serviceTitle }: ContactModalProps) {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-textDark/5 bg-brand-bgLight/50">
               <div>
                  <h2 className="text-2xl font-bold text-brand-textDark">Request a Quote</h2>
                  <p className="text-sm text-brand-textDark/60 font-medium">For: {serviceTitle}</p>
               </div>
               <button 
                 onClick={onClose}
                 className="p-2 hover:bg-brand-textDark/5 rounded-full transition-colors"
                >
                 <X className="w-6 h-6 text-brand-textDark/40 hover:text-brand-textDark" />
               </button>
            </div>

            {/* Form Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <ContactForm initialService={serviceTitle} />
            </div>

            {/* Decorative bottom bar */}
            <div className="h-2 bg-brand-primary/10" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
