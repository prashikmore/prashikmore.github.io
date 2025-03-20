import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import emailjs, { init } from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "./emailConfig";
import {
  canSendEmail,
  incrementEmailCount,
  getRemaining,
} from "../../utils/emailLimiter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  @media (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0px 0px 80px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card};
  padding: 32px;
  border-radius: 16px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  margin-top: 28px;
  gap: 12px;
`;

const ContactTitle = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 2px;
`;

const ContactButton = styled.button`
  flex: 1;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  padding: 13px 16px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StyledToaster = styled(Toaster)`
  && {
    z-index: 10000;
  }

  .react-hot-toast {
    z-index: 10000;
  }
`;

// Remove this styled component
// const RemainingEmails = styled.span`...`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Contact = () => {
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  const sendEmailManually = async () => {
    const form = formRef.current;
    const email = form.from_email.value;
    const name = form.from_name.value;
    const subject = form.subject.value;
    const message = form.message.value;

    // Open default email client
    const mailtoLink = `mailto:contact.prashikmore@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\nMessage:\n${message}`
    )}`;

    window.open(mailtoLink);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check email limit before proceeding
    if (!canSendEmail()) {
      // Show toast and redirect after a short delay
      toast.error("Message limit reached. Redirecting to Email...", {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "#fff",
          zIndex: 10000,
        },
      });

      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        sendEmailManually();
      }, 1000);

      return;
    }

    setIsSending(true);

    const form = formRef.current;

    // Form validation with updated field names
    const email = form.from_email.value; // Changed from user_email
    const name = form.from_name.value; // Changed from user_name
    const subject = form.subject.value;
    const message = form.message.value;

    const loadingToast = toast.loading("Sending message...", {
      style: {
        background: "#1e293b",
        color: "#fff",
        zIndex: 10000,
      },
    });

    // Basic validation
    if (!email || !name || !subject || !message) {
      toast.error("Please fill in all fields", {
        id: loadingToast,
        duration: 3000,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        id: loadingToast,
        duration: 3000,
      });
      return;
    }

    const formData = {
      email,
      name,
      subject,
      message,
      created_at: new Date().toISOString(),
    };

    try {
      // Store data in Supabase
      const { error: supabaseError } = await supabase
        .from("contacts")
        .insert([formData]);

      if (supabaseError) throw supabaseError;

      console.log("Sending email with data:", {
        email,
        name,
        subject,
        message,
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        userId: EMAILJS_USER_ID,
      });

      // Send email using EmailJS
      const emailResult = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form,
        EMAILJS_USER_ID
      );

      console.log("EmailJS Response:", emailResult);

      if (emailResult.status !== 200) {
        console.error("EmailJS Response:", emailResult);
        throw new Error(`Failed to send email: ${emailResult.text}`);
      }

      // Increment the counter only after successful send
      incrementEmailCount();

      // Update success toast message in the try block
      toast.success(`Message sent successfully! 🎉`, {
        id: loadingToast,
        duration: 4000,
      });

      form.reset();
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        stack: err.stack,
        emailJSError: err.text,
      });
      toast.error(err.message || "Failed to send message. Please try again.", {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Add this to show remaining emails in the form
  const remainingEmails = getRemaining();

  return (
    <Container id="contact">
      <Wrapper>
        <StyledToaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            zIndex: 10000, // Add this to ensure toasts appear above everything
            top: 80, // Add this to position below navbar
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              maxWidth: "350px",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 10000, // Add this as well
            },
            success: {
              style: {
                background: "#22c55e",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
            loading: {
              style: {
                background: "#1e293b",
              },
            },
          }}
        />
        <Title>Contact</Title>
        <Desc>
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm ref={formRef} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput
            placeholder="Your Email"
            name="from_email" // Changed from user_email
            type="email"
            required
          />
          <ContactInput
            placeholder="Your Name"
            name="from_name" // Changed from user_name
            type="text"
            required
          />
          <ContactInput
            placeholder="Subject"
            name="subject" // Make sure this matches
            type="text"
            required
          />
          <ContactInputMessage
            placeholder="Message"
            name="message" // Make sure this matches
            rows="4"
            required
          />
          <ButtonContainer>
            <ContactButton type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </ContactButton>
            <ContactButton type="button" onClick={sendEmailManually}>
              Send Email
            </ContactButton>
          </ButtonContainer>
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
