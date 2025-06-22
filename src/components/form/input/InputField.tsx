import { Label } from "@/components/ui/label";
import React, { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  value?: string | number; // <-- Added
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  value,
  placeholder,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  required = false,
  readOnly = false,
  hint,
  label = "",
}) => {
  let inputClasses = `w-full h-11 rounded-sm border-[1px] appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-red-800 border-red-500/50  focus:ring-red-500/10 dark:text-red-400 dark:border-red-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:border-gray-400 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative w-full space-y-1">
      <Label>{label}{required && <span className="text-red-500 text-xs">*</span>}</Label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value} // <-- Controlled input
          placeholder={placeholder}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={inputClasses}
          required={required}
          readOnly={readOnly}
        />

        {hint && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-500" : success ? "text-success-500" : "text-gray-500"}`}>
            {hint}
          </p>
        )}


      </div>
    </div>
  );
};

export default Input;
