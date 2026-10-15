export function uniqueRoleOptions(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string => typeof value === "string")
    .map(value => value.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function invitationScope(role: string, designation = "") {
  const lawyer = ["LACON LAWYER", "PRO BONO LAWYER"].includes(role);
  return {
    designation: lawyer || role === "INTERNAL PARALEGAL",
    state: lawyer || ["STATE COORDINATOR", "CENTRE COORDINATOR"].includes(role) ||
      (role === "INTERNAL PARALEGAL" && designation === "State Office"),
    zone: role === "ZONAL DIRECTOR" || (role === "INTERNAL PARALEGAL" && designation === "Zonal Office"),
    center: role === "CENTRE COORDINATOR" || (lawyer && designation === "Centre Lawyer"),
  };
}
