'use client';

import InputField from '@/components/form/input/InputField';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { COURT_STAGE_OPTIONS, todayISO } from '@/lib/form-options';
import { ProBonoCase } from '../server/probunoTypes';

type CurrentProBonoCasesProps = {
    cases: ProBonoCase[];
    onChange: (cases: ProBonoCase[]) => void;
};

export const createEmptyProBonoCase = (id = '1'): ProBonoCase => ({
    id,
    client_name: '',
    sex: '',
    date_case_taken: '',
    nature_of_service: '',
    offering_charge: '',
    suit_number: '',
    status_of_case: '',
    last_date_of_appearance: '',
    is_client_in_custody: '',
});

export default function CurrentProBonoCases({ cases, onChange }: CurrentProBonoCasesProps) {
    const updateCase = (id: string, field: keyof ProBonoCase, value: string) => {
        onChange(cases.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeCase = (id: string) => {
        if (cases.length > 1) onChange(cases.filter(item => item.id !== id));
    };

    return (
        <section className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
                SECTION 5: Current Pro Bono Cases <span className="text-red-500 text-xs">*</span>
            </h2>
            <p className="text-sm text-gray-600">List every pro bono case you are currently handling.</p>

            {cases.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">Case {index + 1}</h3>
                        {cases.length > 1 && (
                            <Button type="button" variant="ghost" onClick={() => removeCase(item.id)} className="text-red-600">
                                Remove case
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Client Name"
                            required
                            value={item.client_name}
                            onChange={(event) => updateCase(item.id, 'client_name', event.target.value)}
                        />
                        <SelectField
                            name={`cases[${index}].sex`}
                            label="Gender"
                            required
                            placeholder="Select gender"
                            options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                            value={item.sex}
                            onValueChange={(value) => updateCase(item.id, 'sex', value)}
                        />
                        <InputField
                            label="Date/Year you took the case"
                            type="date"
                            required
                            max={todayISO()}
                            value={item.date_case_taken}
                            onChange={(event) => updateCase(item.id, 'date_case_taken', event.target.value)}
                        />
                        <InputField
                            label="Nature of Services being provided"
                            required
                            value={item.nature_of_service}
                            onChange={(event) => updateCase(item.id, 'nature_of_service', event.target.value)}
                        />
                        <InputField
                            label="Offence/Charge"
                            required
                            value={item.offering_charge}
                            onChange={(event) => updateCase(item.id, 'offering_charge', event.target.value)}
                        />
                        <InputField
                            label="Suit Number"
                            required
                            placeholder="XX/XXXX/XX"
                            value={item.suit_number}
                            onChange={(event) => updateCase(item.id, 'suit_number', event.target.value)}
                        />
                        <SelectField
                            name={`cases[${index}].status_of_case`}
                            label="Status of the case"
                            required
                            placeholder="Select court stage"
                            options={COURT_STAGE_OPTIONS}
                            value={item.status_of_case}
                            onValueChange={(value) => updateCase(item.id, 'status_of_case', value)}
                        />
                        <InputField
                            label="Last Date of Appearance"
                            type="date"
                            required
                            max={todayISO()}
                            value={item.last_date_of_appearance}
                            onChange={(event) => updateCase(item.id, 'last_date_of_appearance', event.target.value)}
                        />
                        <SelectField
                            name={`cases[${index}].is_client_in_custody`}
                            label="Is Client in Custody?"
                            required
                            placeholder="Select option"
                            options={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]}
                            value={item.is_client_in_custody}
                            onValueChange={(value) => updateCase(item.id, 'is_client_in_custody', value)}
                        />
                    </div>
                </div>
            ))}

            <Button type="button" onClick={() => onChange([...cases, createEmptyProBonoCase(Date.now().toString())])} className="w-full bg-gray-700 hover:bg-gray-800">
                + Add Another Case
            </Button>
        </section>
    );
}
