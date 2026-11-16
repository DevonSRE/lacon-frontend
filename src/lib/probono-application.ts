import type { ILawyerRequest } from "@/types/case";

/**
 * One pro bono application, as the screens read it.
 *
 * The API answers in snake_case and the tables were written against PascalCase,
 * so the names are translated in one place. Both the applications list and the
 * review dialog read it: the review needs fields the list does not carry
 * (the declared cases), so it fetches the single application and maps it the
 * same way (QA 2026-11-01 run 4, 13 Nov, rows 36 and 37).
 */
export function readApplication(raw: Record<string, unknown>): ILawyerRequest {
  const courts = raw.criminal_courts_preference;
  return {
    ...(raw as object),
    ID: raw.user_id,
    ApplicationID: raw.id,
    FirstName: raw.first_name,
    LastName: raw.last_name,
    Email: raw.email,
    PhoneNumber: raw.phone_number,
    AltNumber: raw.alternate_number,
    YearOfCall: raw.year_of_call,
    NBANumber: raw.nba_branch,
    Experience: raw.experience_in_criminal_law,
    MaxLoad: raw.pro_bono_capacity,
    PreferredCourt: Array.isArray(courts) ? courts.join(", ") : courts,
    Status: String(raw.status ?? "").toUpperCase(),
    CreatedAt: raw.created_at,
    LawFirmName: raw.law_firm_name,
    LawFirmAddress: raw.law_firm_address,
    StateBarMembership: raw.state_bar_membership,
    MostContactableNumber: raw.most_contactable_number,
    StateOfPractice: raw.state_of_practice,
    RegistrationSource: raw.registration_source,
    PrincipalName: raw.principal_name,
    LawyersCountInFirm: raw.lawyers_count_in_firm,
    AreasCovered: raw.areas_covered,
    ClientBase: raw.client_base,
    SourceOfClients: raw.source_of_clients,
    DeclaredCases: raw.declared_cases,
    DecisionReason: raw.decision_reason,
    DecidedBy: raw.decided_by,
    DecidedAt: raw.decided_at,
  } as unknown as ILawyerRequest;
}
