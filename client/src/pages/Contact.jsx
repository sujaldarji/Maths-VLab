<<<<<<< HEAD
import React, { useState } from "react";
import "../styles/contact.css";
import { FaRegCommentDots } from "react-icons/fa";
import { validateName, validateEmail } from "../utils/validate";
import { sanitizeInput } from "../utils/sanitizeInput";
import axios from "axios";
const ContactUs = () => {
const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if form was submitted

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors dynamically as user types
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validate Form
  const validateForm = () => {
    let validationErrors = {};
    validationErrors.name = validateName(formData.name) || "";
    validationErrors.email = validateEmail(formData.email) || "";
    validationErrors.message = formData.message.trim() ? "" : "Message cannot be empty.";

    return validationErrors;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Mark as submitted

    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If errors exist, return
    if (Object.values(validationErrors).some((error) => error !== "")) return;

    setIsSubmitting(true);
    setStatus(null); // Reset status before sending request

    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
      };

      const response = await axios.post("http://localhost:3001/api/contactRoutes/", sanitizedData);
      setStatus({ type: "success", message: response.data.message });

      setFormData({ name: "", email: "", message: "" }); // Reset form
      setIsSubmitted(false); // Reset submission state

      // Hide success message after 5s
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="contact-us">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
      </div>

      {/* Contact Form Section */}
      <div className="contact-container">
        {/* Left Section */}
        <div className="contact-info">
          <FaRegCommentDots className="contact-icon" />
          <h2>We’d Love to Hear From You!</h2>
          <p>
            Have a question, suggestion, or just want to say hello? We're here to help!
            Whether it's feedback about our platform or collaboration opportunities, feel free to drop us a message.
          </p>
          <p>Our team will get back to you as soon as possible. Thank you for reaching out!</p>
        </div>

        {/* Right Section - Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
          {isSubmitted && errors.name && <span className="error">{errors.name}</span>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter a valid email address"
            value={formData.email}
            onChange={handleChange}
          />
          {isSubmitted && errors.email && <span className="error">{errors.email}</span>}

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          {isSubmitted && errors.message && <span className="error">{errors.message}</span>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "SUBMIT"}
          </button>

          {/* Success or Error Message */}
          {status && (
            <p className={status.type === "success" ? "success" : "error"}>{status.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

=======
import React, { useState } from "react";
import "../styles/contact.css";
import { FaRegCommentDots } from "react-icons/fa";
import { validateName, validateEmail } from "../utils/validate";
import { sanitizeInput } from "../utils/sanitizeInput";
import axios from "axios";
const ContactUs = () => {
const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if form was submitted

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors dynamically as user types
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validate Form
  const validateForm = () => {
    let validationErrors = {};
    validationErrors.name = validateName(formData.name) || "";
    validationErrors.email = validateEmail(formData.email) || "";
    validationErrors.message = formData.message.trim() ? "" : "Message cannot be empty.";

    return validationErrors;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Mark as submitted

    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If errors exist, return
    if (Object.values(validationErrors).some((error) => error !== "")) return;

    setIsSubmitting(true);
    setStatus(null); // Reset status before sending request

    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
      };

      const response = await axios.post("http://localhost:3001/api/contactRoutes/", sanitizedData);
      setStatus({ type: "success", message: response.data.message });

      setFormData({ name: "", email: "", message: "" }); // Reset form
      setIsSubmitted(false); // Reset submission state

      // Hide success message after 5s
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="contact-us">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
      </div>

      {/* Contact Form Section */}
      <div className="contact-container">
        {/* Left Section */}
        <div className="contact-info">
          <FaRegCommentDots className="contact-icon" />
          <h2>We’d Love to Hear From You!</h2>
          <p>
            Have a question, suggestion, or just want to say hello? We're here to help!
            Whether it's feedback about our platform or collaboration opportunities, feel free to drop us a message.
          </p>
          <p>Our team will get back to you as soon as possible. Thank you for reaching out!</p>
        </div>

        {/* Right Section - Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
          {isSubmitted && errors.name && <span className="error">{errors.name}</span>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter a valid email address"
            value={formData.email}
            onChange={handleChange}
          />
          {isSubmitted && errors.email && <span className="error">{errors.email}</span>}

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          {isSubmitted && errors.message && <span className="error">{errors.message}</span>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "SUBMIT"}
          </button>

          {/* Success or Error Message */}
          {status && (
            <p className={status.type === "success" ? "success" : "error"}>{status.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

>>>>>>> 59d7a14 (sample content for algebra topic)
