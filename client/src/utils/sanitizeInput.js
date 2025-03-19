import DOMPurify from "dompurify";

export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input; // Ensure only strings are sanitized
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim(); // Remove HTML tags & trim spaces
};
