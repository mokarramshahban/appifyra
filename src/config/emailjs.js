// EmailJS configuration
// Sign up at https://www.emailjs.com/ (Free 200 emails/month)
// 1. Create an Email Service (e.g. Gmail connected to appifyra@gmail.com)
// 2. Create an Email Template
// 3. Get your Public Key from Account Settings

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_appifyra',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_appifyra',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'user_appifyra_key'
};
