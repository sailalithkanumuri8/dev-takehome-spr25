import React, { useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption?.label || placeholder;

  const handleSelect = (optionValue: string): void => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full py-2 px-4 rounded-md border bg-white text-left
          flex items-center justify-between transition-colors
          ${disabled 
            ? "border-gray-stroke bg-gray-fill text-gray-text cursor-not-allowed" 
            : "border-gray-stroke hover:border-primary focus:border-primary focus:outline-none"
          }
        `}
      >
        <span className={selectedOption ? "text-black" : "text-gray-text"}>
          {displayText}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-stroke rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-4 py-2 cursor-pointer transition-colors
                  hover:bg-primary-fill hover:text-primary
                  ${value === option.value ? "bg-primary-fill text-primary font-medium" : "text-gray-900"}
                `}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
