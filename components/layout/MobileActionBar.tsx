"use client";

import { MessageCircle, Phone } from "lucide-react";
import { company } from "@/lib/content/services";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f7f4ed]/92 p-3 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a className="btn-primary min-h-12" href={company.phoneHref}>
          <Phone size={18} aria-hidden="true" />
          Volať
        </a>
        <a className="btn-secondary min-h-12" href={company.whatsappHref} target="_blank" rel="noreferrer">
          <MessageCircle size={18} aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
