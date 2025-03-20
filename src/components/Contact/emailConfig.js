export const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
export const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

// Add validation
if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_USER_ID) {
  console.error("Missing EmailJS configuration:", {
    serviceId: !!EMAILJS_SERVICE_ID,
    templateId: !!EMAILJS_TEMPLATE_ID,
    userId: !!EMAILJS_USER_ID,
  });
}
