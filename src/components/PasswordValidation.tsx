
'use client';
import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import Input from "./form/input/InputField";

const PasswordValidation = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    const strengthLevels = [
      { label: "", color: "bg-gray-200" },
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" }
    ];

    return {
      score,
      label: strengthLevels[score].label,
      color: strengthLevels[score].color
    };
  }, [password]);

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a special character", met: /[\W_]/.test(password) },
  ];

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const confirmPasswordError = confirmPassword && password !== confirmPassword;

  return (
    <div className="mx-auto bg-white rounded-lg">
      {/* Create Password */}
      <div className="mb-4">
        <Label className="">Create Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg dark:focus:border-brand-800 focus:outline-none text-lg pr-12"
            placeholder="••••••••••••••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-3">
            <div className="flex space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full ${level <= passwordStrength.score
                      ? passwordStrength.color
                      : "bg-gray-200"
                    }`}
                />
              ))}
            </div>
            {passwordStrength.label && (
              <p className={`text-sm text-end font-medium ${passwordStrength.score >= 4 ? "text-green-600" :
                  passwordStrength.score >= 3 ? "text-blue-600" :
                    passwordStrength.score >= 2 ? "text-yellow-600" : "text-red-600"
                }`}>
                {passwordStrength.label} Password
              </p>
            )}
          </div>
        )}

        {/* Password Requirements */}
        {/* {password && (
          <div className="mt-3 space-y-1">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${req.met ? "bg-green-500" : "bg-gray-300"
                  }`}>
                  {req.met && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={req.met ? "text-green-600" : "text-gray-500"}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )} */}
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <Label className=""> Confirm Password</Label>
        <div className="relative">
          <Input
            type="password"
            // value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${confirmPasswordError
                ? "border-red-500 focus:border-red-500"
                : passwordsMatch
                  ? "border-green-500 focus:border-green-500"
                  : "border-gray-300 dark:focus:border-brand-800"
              }`}
            placeholder="••••••••••••••••••••••••"
          />
          {passwordsMatch && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {confirmPasswordError && (
          <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
        )}

        {passwordsMatch && (
          <p className="mt-2 text-sm text-green-600">Passwords match</p>
        )}
      </div>

    </div>
  );
};

export default PasswordValidation;

