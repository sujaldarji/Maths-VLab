import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input) => {
    return sanitizeHtml(input, {
        allowedTags: [], // Remove all HTML tags
        allowedAttributes: {}, // Remove all attributes
    }).trim(); // Trim spaces
};
