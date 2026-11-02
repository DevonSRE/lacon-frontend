/**
 * Turns an export response into something a client component can save.
 *
 * The API answers errors with a JSON envelope, so a JSON body is never a file:
 * without this check a failed export downloads as a corrupt spreadsheet.
 *
 * Not a server action — a plain helper the export actions share.
 */
const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type Download = { success: true; data: string; filename: string; contentType: string };
export type DownloadFailure = { success: false; status: number; message: string };

export function toDownload(
  response: { data: ArrayBuffer; headers: Record<string, unknown> },
  fallbackName: string,
): Download | DownloadFailure {
  const contentType = String(response.headers["content-type"] ?? XLSX_TYPE);
  const buffer = Buffer.from(response.data);
  if (contentType.includes("application/json")) {
    let message = "The report could not be exported.";
    try {
      message = JSON.parse(buffer.toString("utf8"))?.message || message;
    } catch { }
    return { success: false, status: 500, message };
  }
  const disposition = String(response.headers["content-disposition"] ?? "");
  const filename = /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? fallbackName;
  return { success: true, data: buffer.toString("base64"), filename, contentType };
}
