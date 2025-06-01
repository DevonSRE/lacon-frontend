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
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
  formData: { [key: string]: any };
  handleSelectChange: any;
  errors: { [key: string]: string };
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  required = false,
  formData,
  handleSelectChange,
  errors,
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500 text-xs">*</span>}
      </Label>
      <Select
        value={typeof formData[name] === "string" ? formData[name] : ""}
        onValueChange={(value) => handleSelectChange(name, value)}
      >
        <SelectTrigger
          id={name}
          className={`w-full h-11 ${errors[name] ? "border-red-500" : ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && (
        <p className="text-red-500 text-xs">{errors[name]}</p>
      )}
    </div>
  );
};

export default SelectField;
