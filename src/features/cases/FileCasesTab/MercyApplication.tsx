"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useState } from "react";
import { toast } from "sonner";
import { CloudUpload } from "lucide-react";

import InputField from "@/components/form/input/InputField";
import { GetState } from "@/components/get-state";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { submitMercyApplicationForm } from "@/features/probunoLawyers/server/action";
import { FormDataMercyCase } from "@/features/probunoLawyers/server/probonoSchema";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { CLIENT_ERROR_STATUS, SUCCESS_STATUS } from "@/lib/constants";
import CaseCreated from "../_components/CaseCreated";
import { useQueryClient } from "@tanstack/react-query";

type CustomeSheetProps = {
  openFileACase: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MercyApplication({
  openFileACase,
  setOpen,
}: CustomeSheetProps) {
  const router = useRouter();

  const [recommendationImage, setRecommendationImage] = useState<File | null>(
    null
  );
  const [state, formAction, isPending] = useActionState(
    submitMercyApplicationForm,
    undefined
  );
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const [formData, setFormData] = useState<FormDataMercyCase>({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    age: 0,
    correctional_facility: "",
    offence: "",
    case_type: "MERCY APPLICATION",
    sentence_passed: "",
    date_of_sentence: "",
    perogative_of_mercy: 0,
    reason_for_clemency: "",
    health_condition: "",
    is_recommendations: "no",
    recommendations: null,
  });

  const [confessionalStatement, setConfessionalStatement] =
    useState<string>("");

  useEffectAfterMount(() => {
    if (!state) return;
    if (CLIENT_ERROR_STATUS.includes(state.status)) {
      toast.error(
        typeof state.message === "string"
          ? state.message
          : "Something went wrong",
        {
          description:
            typeof state?.errors === "string"
              ? state.errors
              : state?.errors
                ? Object.values(state.errors).flat().join(", ")
                : undefined,
        }
      );
    }
    if (SUCCESS_STATUS.includes(state.status)) {
      queryClient.invalidateQueries({ queryKey: ["getCases"] });
      toast.success("Mercy application submitted successfully");
      setCurrentStep(3);
    }
  }, [state]);

  const clearFieldError = (name: string) => {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "confessional_statement") {
      setConfessionalStatement(value);
      clearFieldError(name);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If user switched to "no", clear any uploaded file + file errors
    if (name === "is_recommendations" && value === "no") {
      setRecommendationImage(null);
      setFileError("");
    }

    clearFieldError(name);
  };

  const updateField = (
    field: keyof FormDataMercyCase | "recommendations",
    value: string | number | File | null
  ) => {
    if (field === "age") {
      const age =
        typeof value === "string" ? parseInt(value, 10) || 0 : Number(value);
      setFormData((prev) => ({ ...prev, age }));
      clearFieldError("age");
      return;
    }

    if (field === "recommendations") {
      setRecommendationImage(value instanceof File ? value : null);
      clearFieldError("recommendations");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" || typeof value === "number"
          ? value
          : (value as never),
    }));

    clearFieldError(field);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age || formData.age <= 0) newErrors.age = "Age is required";
    if (!formData.correctional_facility.trim())
      newErrors.correctional_facility = "Correctional facility is required";
    if (!formData.offence.trim())
      newErrors.offence = "Offense description is required";
    if (!confessionalStatement)
      newErrors.confessional_statement =
        "Confessional statement field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const fd = new FormData();

    fd.append("case_type", "MERCY APPLICATION");
    if (selectedState) fd.append("state_id", selectedState);

    fd.append("first_name", formData.first_name);
    if (formData.middle_name) fd.append("middle_name", formData.middle_name);
    fd.append("last_name", formData.last_name);
    fd.append("gender", formData.gender);
    fd.append("age", String(formData.age));
    fd.append("correctional_facility", formData.correctional_facility);
    fd.append("offence", formData.offence);
    fd.append("confessional_statement", confessionalStatement);
    fd.append("is_recommendations", formData.is_recommendations || "");

    fd.append("sentence_passed", formData.sentence_passed || "");
    fd.append("date_of_sentence", formData.date_of_sentence || "");
    fd.append("perogative_of_mercy", String(formData.perogative_of_mercy ?? 0));
    fd.append("reason_for_clemency", formData.reason_for_clemency || "");
    fd.append("health_condition", formData.health_condition || "");

    if (recommendationImage) {
      fd.append("recommendations", recommendationImage);
    }

    formAction(fd);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setFileError("No file selected.");
      updateField("recommendations", null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please upload a valid image file.");
      updateField("recommendations", null);
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setFileError("File size exceeds 5MB limit.");
      updateField("recommendations", null);
      return;
    }

    setFileError("");
    updateField("recommendations", file);
  };

  const renderStep1 = () => (
    <div className="gap-4 mt-4 flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="flex-1">
          <InputField
            label="Inmate First Name"
            type="text"
            placeholder="Enter First Name"
            value={formData.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
            required
            className="w-full p-2 mt-1 rounded border border-gray-300"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        <div className="flex-1">
          <InputField
            label="Inmate Middle Name"
            type="text"
            placeholder="Enter Middle Name"
            value={formData.middle_name}
            onChange={(e) => updateField("middle_name", e.target.value)}
            className="w-full p-2 mt-1 rounded border border-gray-300"
          />
        </div>

        <div className="flex-1">
          <InputField
            label="Inmate Last Name"
            type="text"
            placeholder="Enter Last Name"
            value={formData.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
            required
            className="w-full p-2 mt-1 rounded border border-gray-300"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="state-select">Where are you filing from?</Label>
        <GetState
          value={selectedState}
          onValueChange={(val: string) => setSelectedState(val)}
          placeholder="Select your state"
          onLoadingChange={() => { }}
        />
      </div>

      <div>
        <SelectField
          name="gender"
          label="Gender"
          placeholder="Select Gender"
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
          required
          value={formData.gender}
          onValueChange={(value) => handleSelectChange(value, "gender")}
          error={!!errors.gender}
          errorMessage={errors.gender}
        />
      </div>

      <div>
        <InputField
          label="Age"
          type="number"
          placeholder="Enter Current Age"
          value={String(formData.age || "")}
          onChange={(e) => updateField("age", e.target.value)}
          required
          className="w-full p-2 mt-1 rounded border border-gray-300"
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age}</p>
        )}
      </div>

      <div>
        <InputField
          label="Correctional Facility Name"
          type="text"
          placeholder="Enter Correctional Facility Name"
          value={formData.correctional_facility}
          onChange={(e) => updateField("correctional_facility", e.target.value)}
          required
          className="w-full p-2 mt-1 rounded border border-gray-300"
        />
        {errors.correctional_facility && (
          <p className="text-red-500 text-sm mt-1">
            {errors.correctional_facility}
          </p>
        )}
      </div>

      <div>
        <Label>
          Offense Committed<span className="text-red-500">*</span>
        </Label>
        <textarea
          placeholder="Describe the Offense"
          value={formData.offence}
          onChange={(e) => updateField("offence", e.target.value)}
          required
          className="w-full p-2 mt-1 rounded border border-gray-300 min-h-[60px]"
        />
        {errors.offence && (
          <p className="text-red-500 text-sm mt-1">{errors.offence}</p>
        )}
      </div>

      <div>
        <InputField
          label="Sentence Passed"
          type="text"
          placeholder="e.g 10 years imprisonment"
          value={formData.sentence_passed || ""}
          onChange={(e) => updateField("sentence_passed", e.target.value)}
          className="w-full p-2 mt-1 rounded border border-gray-300"
        />
      </div>

      <div>
        <InputField
          label="Date of Sentence"
          type="date"
          placeholder="dd/mm/yy"
          value={formData.date_of_sentence || ""}
          onChange={(e) => updateField("date_of_sentence", e.target.value)}
          className="w-full p-2 mt-1 rounded border border-gray-300"
        />
      </div>

      <div>
        <SelectField
          name="confessional_statement"
          label="Is there a Confessional Statement?"
          placeholder="Yes or No"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          required
          value={confessionalStatement}
          onValueChange={(value) =>
            handleSelectChange(value, "confessional_statement")
          }
          error={!!errors.confessional_statement}
          errorMessage={errors.confessional_statement}
        />
      </div>

      <div>
        <InputField
          label="Reason for Clemency / Humanitarian Consideration"
          type="text"
          placeholder="Explain Reason for mercy application here"
          value={formData.reason_for_clemency || ""}
          onChange={(e) => updateField("reason_for_clemency", e.target.value)}
          className="w-full p-2 mt-1 rounded border border-gray-300"
        />
      </div>

      <div className="space-y-2 mb-4">
        <InputField
          label="Any Disability or Serious Health Condition?"
          type="text"
          placeholder="Describe any health conditions"
          value={formData.health_condition || ""}
          onChange={(e) => updateField("health_condition", e.target.value)}
          className="w-full p-2 mt-1 rounded border border-gray-300"
        />

        <SelectField
          name="is_recommendations"
          label="Recommendation from Prison Authority (If Available)"
          placeholder="If yes, upload picture proof"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={formData.is_recommendations}
          onValueChange={(value) =>
            handleSelectChange(value, "is_recommendations")
          }
          error={!!errors.is_recommendations}
          errorMessage={errors.is_recommendations}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="mx-auto">
        {currentStep === 3 && (
          <CaseCreated setOpen={setOpen} openFileACase={openFileACase} details={{
            details: null
          }} />
          //TODO :: Please continue from here... get casedetials from API after successful creating then populate here

        )}

        {currentStep === 1 && (
          <>
            <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:items-center mb-6">
              <div className="flex items-center sm:mb-0">
                <h1 className="text-lg font-semibold text-gray-900">
                  Filing A Mercy Application
                </h1>
              </div>
              <div className="flex sm:ml-auto space-x-2 justify-start sm:justify-end">
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-medium ${currentStep === 1
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  1
                </div>
                {/* <div className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-medium bg-gray-200 text-gray-600">
                  2
                </div> */}
              </div>
            </div>

            {/* Submit with JS handler so we can send FormData to the server action */}
            {/* <form  onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              noValidate
            > */}

            <form action={submit}>
              <div>
                <Label>Case Type</Label>
                <div className="bg-gray-100 p-2 rounded mt-1 text-gray-700">
                  Mercy Application
                </div>
              </div>

              {renderStep1()}

              {state?.errors && typeof state.errors === "object" && (
                <div className="text-red-500 bg-red-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(state.errors).map(([key, val]) =>
                      Array.isArray(val) ? (
                        val.map((msg, idx) => (
                          <li key={`${key}-${idx}`}>
                            {key.replace(/_/g, " ")}: {msg}
                          </li>
                        ))
                      ) : (
                        <li key={key}>
                          {key.replace(/_/g, " ")}: {String(val)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="h-11 w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-11 w-full bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  {isPending ? "Submitting..." : "Submit Case"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
