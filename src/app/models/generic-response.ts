export interface GenericResponse {
    status: "success" | "error";
    error?: string;
    message?: string;
}