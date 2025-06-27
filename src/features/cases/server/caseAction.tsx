'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage, NEXT_BASE_URL } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import casesServices from "./caseService";
import z from "zod";

const assigncase = z.object({
    casefile_id: z.string().min(1, { message: "Please select case file" }),
    assignee_id: z.string().min(1, { message: "Please select assignee" }),
    is_reassigned: z.coerce.boolean(),
});

const updateCase = z.object({
    id: z.any().optional(),
    casefile_id: z.string().min(1, { message: "Please select case file" }),
    court_progress: z.string().min(1, { message: "Please select Court Progress" }),
    next_step: z.string().min(1, { message: "Please select next step" }),
    current_status: z.string().min(1, { message: "Please select current status" }),
    supporting_documents: z.any().optional(),
});

const uploadDocument = z.object({
    document_title: z.string().min(1, { message: "Please select Court Progress" }),
    document_type: z.string().min(1, { message: "Please select Court Progress" }),
    update_type: z.string().min(1, { message: "Please select next step" }),
    document_path: z.any().optional(),
    casefile_id: z.any().optional(),
});

export async function GetCaseAction(params: Ipage) {
    try {
        console.log("params in get cases => " + JSON.stringify(params));
        const response = await casesServices.getCases(params);
        console.log("response in get cases => " + response.data.data);
        return { data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetEventsAction(params: Ipage, id: string) {
    try {
        console.log("params in get cases => " + JSON.stringify(params));
        const response = await casesServices.getEvents(params, id);
        return { data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

// export async function AssignCaseAction() {
export async function AssignCaseAction(_prevState: unknown, formData: FormData) {
    const result = assigncase.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Select Assignee",
        };
    }
    try {
        const response = await casesServices.AssignCases(result.data);
        return { status: 200, data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

export async function CaseUpdate(_prevState: unknown, formData: FormData) {
    const result = updateCase.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Check the fields",
        };
    }
    try {
        // Handle disability proof upload
        let supporting_documents;
        const file = formData.get('supporting_documents');
        if (file instanceof Blob) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            const uploadFile = await fetch(`${NEXT_BASE_URL}/media?category=document`, {
                method: "POST",
                body: fileFormData,
            });
            if (!uploadFile.ok) {
                let errorData;
                try {
                    errorData = await uploadFile.json();
                } catch {
                    errorData = { message: "Unknown error uploading file" };
                }
                console.error("Upload file error:", errorData);
                throw {
                    response: {
                        status: uploadFile.status,
                        data: errorData,
                    },
                };
            }
            const uploadResult = await uploadFile.json();
            supporting_documents = uploadResult?.data;
            console.log("File uploaded successfully:", supporting_documents);
        }
        // Prepare data for API call
        let uploadData = { ...result.data };
        if (supporting_documents != null) {
            uploadData.supporting_documents = supporting_documents;
        }
        console.log("uploadData => " + JSON.stringify(uploadData));
        const response = await casesServices.UpdateCasesFile(uploadData, uploadData.id);
        console.log(response);
        return { status: 200, data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}


export async function UploadCaseDocumentAction(_prevState: unknown, formData: FormData) {
    console.log("formData => " + JSON.stringify(Object.fromEntries(formData)));
    const result = uploadDocument.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Check the fields",
        };
    }
    try {
        let document_path;
        const file = formData.get('document_path');
        if (file instanceof Blob) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            const uploadFile = await fetch(`${NEXT_BASE_URL}/media?category=document`, {
                method: "POST",
                body: fileFormData,
            });
            if (!uploadFile.ok) {
                let errorData;
                try {
                    errorData = await uploadFile.json();
                } catch {
                    errorData = { message: "Unknown error uploading file" };
                }
                console.error("Upload file error:", errorData);
                throw {
                    response: {
                        status: uploadFile.status,
                        data: errorData,
                    },
                };
            }
            const uploadResult = await uploadFile.json();
            document_path = uploadResult?.data;
            console.log("File uploaded successfully:", document_path);
        }
        // Prepare data for API call
        let uploadData = { ...result.data };
        if (document_path != null) {
            uploadData.document_path = document_path;
        }
        console.log("uploadData => " + JSON.stringify(uploadData));
        const response = await casesServices.UploadeDocument(uploadData, uploadData.casefile_id);
        return { status: 200, data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}




