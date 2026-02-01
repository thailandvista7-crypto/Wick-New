'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  question: string;
  answer: string;
}

export function Accordion({ question, answer }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-olive-50 transition-colors"
      >
        <span className="font-semibold text-olive-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-olive-700 flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-olive-100">
          <p className="text-olive-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
