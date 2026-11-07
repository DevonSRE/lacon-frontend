/**
 * The kinds of lawyer the Lawyers list shows and filters by (T9).
 *
 * LACON lawyers are staff; pro bono lawyers register from private practice.
 * The task also names NYSC lawyers, but no such role exists yet — LACON has
 * not defined one — so adding it here and in `FindAllLawyers` is all it will
 * take once they do.
 *
 * This mirrors the roles `FindAllLawyers` returns in
 * `src/repository/user.go`; the two are meant to agree.
 */
export const LAWYER_TYPES = ["LACON LAWYER", "PRO BONO LAWYER"] as const;
