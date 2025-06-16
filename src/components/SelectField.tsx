// components/SelectField.tsx
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string | boolean;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
  value?: string | boolean;
  onValueChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  required = false,
  value = "",
  onValueChange,
  error = false,
  errorMessage,
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500 text-xs">*</span>}
      </Label>
      <Select
        value={value === undefined ? undefined : String(value)}
        onValueChange={onValueChange}
      >
        <SelectTrigger
          id={name}
          className={`w-full h-11 ${error ? "border-red-500" : ""}`}
        >
          <SelectValue className="text-gray-400"  placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && errorMessage && (
        <p className="text-red-500 text-xs">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectField;