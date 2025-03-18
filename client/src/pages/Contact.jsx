import React from "react";
import "../styles/contact.css";

const ContactUs = () => {
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
          <img
            src=""
            alt="icon"
          />
          <h2>We’d Love to Hear From You!</h2>
          <p>
            Have a question, suggestion, or just want to say hello? We're here
            to help! Whether it's feedback about our platform or collaboration
            opportunities, feel free to drop us a message.  
          </p>
          <p>
            Our team will get back to you as soon as possible. Thank you for
            reaching out!
          </p>
        </div>

        {/* Right Section */}
        <form className="contact-form">
          <label>First Name</label>
          <input type="text" placeholder="Enter your First Name" required />

          <label>Email</label>
          <input type="email" placeholder="Enter a valid email address" required />

          <label>Message</label>
          <textarea placeholder="Enter your message" required></textarea>

          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
