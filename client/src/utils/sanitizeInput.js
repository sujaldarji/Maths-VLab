import DOMPurify from "dompurify";

export const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input).trim(); // Remove unwanted HTML and trim spaces
};
