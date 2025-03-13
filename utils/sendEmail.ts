// src/sendEmail.ts
import axios from 'axios';

// Function to send email using Formspree
const sendEmailNotification = async (email: string, subject: string, message: string) => {
  try {
    const response = await axios.post('https://formspree.io/f/xrbgveln', {
      email: email,
      subject: subject,
      message: message
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendEmailNotification };
