// Canonical answer sets from the LACON CMS frontend checklist (lacon-shared).
// Every form that captures one of these must import it from here.

const toOptions = (values: readonly string[]) =>
    values.map(value => ({ value, label: value }));

// Court stage, "Case Status" on the case forms (checklist 3.2).
export const COURT_STAGES = ["Arraignment", "Plea taken", "Hearing/Trial", "Judgement"] as const;
export const COURT_STAGE_OPTIONS = toOptions(COURT_STAGES);

// case_update_type on POST /admin/casefile/{id}/case-update (API swagger enum).
export const CASE_UPDATE_TYPES = ["CASE IN COURT", "MEDIATIONS", "LEGAL ADVICE"] as const;
export const CASE_UPDATE_TYPE_OPTIONS = [
    { value: "CASE IN COURT", label: "Case in court" },
    { value: "MEDIATIONS", label: "Mediation" },
    { value: "LEGAL ADVICE", label: "Legal advice" },
];

// Pro bono forms (checklist 3.6). Both the registration and inventory forms use these.
export const EXPERIENCE_OPTIONS = ["Under 2 years", "2-5 years", "6-10 years", "Over 10 years"] as const;
export const CAPACITY_OPTIONS = [
    "1 case at a time",
    "2 cases at a time",
    "3-5 cases at a time",
    "6 or more cases at a time",
] as const;
export const COURT_PREFERENCE_OPTIONS = [
    "Appellate Courts",
    "High Courts",
    "Magistrate Courts",
    "Customary Court",
    "Sharia Court",
    "Area Court",
] as const;

// Inventory form S5/S6. ALL_CATEGORIES is exclusive; OTHER reveals a text input.
export const ALL_CATEGORIES = "All Categories";
export const OTHER_OPTION = "Other";
export const CLIENT_TYPE_OPTIONS = [
    "Children",
    "Women",
    "Men",
    "Police Detainees",
    "Awaiting Trial Persons in Custody",
    "Prison On-SAR",
    OTHER_OPTION,
    ALL_CATEGORIES,
] as const;
export const REFERRAL_SOURCE_OPTIONS = [
    "Walk-in referrals",
    "Referrals by the Police",
    "Referrals by the Prison",
    "Referrals by the Court",
    "Referrals by NGOs",
    "Referrals by faith-based Organizations",
    OTHER_OPTION,
    ALL_CATEGORIES,
] as const;

export const PRO_BONO_UNDERTAKING =
    "By submitting this form, I certify that the information provided is true and accurate. I undertake to render free legal services with the same professional standards as paid services, and understand that LACON may withdraw my assigned cases if I fail to diligently perform my duties.";

// Today as YYYY-MM-DD in local time, for date inputs' max and "not after today" checks.
export const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
