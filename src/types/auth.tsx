export enum ROLES {
    DIRECTOR_GENERAL = "DIRECTOR GENERAL",
    CIVIL_JUSTICE_DEPT = "CIVIL JUSTICE DEPT. HEAD",
    CRIMINAL_JUSTICE_DEPT = "CRIMINAL JUSTICE DEPT. HEAD",
    PARALEGAL = "PARALEGAL",
    PRO_BONO_LAWYER = "PRO BONO LAWYER",
    LAWYER = "LAWYER",
    CENTRE_COORDINATOR = "CENTRE COORDINATOR",
    ZONAL_DIRECTOR = "ZONAL DIRECTOR",
    STATE_COORDINATOR = "STATE COORDINATOR",
    DECONGESTION_UNIT_HEAD = "DECONGESTION UNIT HEAD",
    PREROGATIVE_OF_MERCY_UNIT_HEAD = "PREROGATIVE OF MERCY UNIT HEAD",
    OSCAR_UNIT_HEAD = "OSCAR UNIT HEAD",
    ADMIN = "ADMIN",
    PLATFORM_ADMIN = "PLATFORM ADMIN"
}


export type TSessionData = {
    user?: TUser;
    token: string;
    expires?: number;
};


export type TUser = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    role: ROLES;
};

export function isFieldErrorObject(
  error: unknown
): error is Record<string, string[]> {
  return (
    typeof error === "object" &&
    error !== null &&
    !Array.isArray(error) &&
    Object.values(error).every(
      (value) => Array.isArray(value) && value.every((item) => typeof item === "string")
    )
  );
}

