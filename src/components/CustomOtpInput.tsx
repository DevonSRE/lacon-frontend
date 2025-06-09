import React, { useRef, useEffect } from 'react';

interface CustomOtpInputProps {
    value: string;
    onChange: (value: string) => void;
    numInputs?: number;
    shouldAutoFocus?: boolean;
}

const CustomOtpInput: React.FC<CustomOtpInputProps> = ({
    value,
    onChange,
    numInputs = 6,
    shouldAutoFocus = true
}) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, numInputs);

        if (shouldAutoFocus && inputRefs.current[0]) {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [numInputs, shouldAutoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value: inputValue } = e.target;

        if (inputValue && !/^\d*$/.test(inputValue)) return;

        if (inputValue.length > 1) {
            const pastedValue = inputValue.split('').slice(0, numInputs);
            const newValue = value.split('');

            pastedValue.forEach((char, idx) => {
                if (index + idx < numInputs) {
                    newValue[index + idx] = char;
                }
            });

            onChange(newValue.join('').slice(0, numInputs));
            const focusIndex = Math.min(index + pastedValue.length, numInputs - 1);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        const newValue = value.split('');
        newValue[index] = inputValue;
        onChange(newValue.join(''));

        if (inputValue && index < numInputs - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newValue = value.split('');
            newValue[index - 1] = '';
            onChange(newValue.join(''));
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
            e.preventDefault();
        }

        if (e.key === 'ArrowRight' && index < numInputs - 1) {
            inputRefs.current[index + 1]?.focus();
            e.preventDefault();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, numInputs);
        if (!/^\d*$/.test(pasteData)) return;

        onChange(pasteData.padEnd(value.length, value.slice(pasteData.length)).slice(0, numInputs));
        const focusIndex = Math.min(pasteData.length, numInputs - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div className="flex justify-center flex-wrap gap-y-3" onPaste={handlePaste}>
            {Array.from({ length: numInputs }).map((_, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-[60px] md:h-[60px] mx-1 sm:mx-2 border border-gray-300 rounded text-xl text-center bg-white"
                    autoComplete="one-time-code"
                    aria-label={`digit ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default CustomOtpInput;
