"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { NEXT_BASE_URL } from "../constants";

export const authConfig = axios.create({
  baseURL: NEXT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getAuthTemp() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("TempToken")?.value;

  // Optionally delete after use
  (await cookieStore).delete("TempToken");

  console.log("Temp token:", token);

  if (!token) {
    return authConfig; // fallback to public config
  }

  return axios.create({
    baseURL: NEXT_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
