import { getUserCollection } from './getUsers';
import { calculateWarrantyExpiry } from './calculateWarrantyExpiry';
import { sendEmailNotification } from './sendEmail';

export const check = async () => {  // Ensure it's exported properly for use
  const users = await getUserCollection(); // Fetch all users from Firestore
  const currentDate = new Date(); // Get today's date

  users.forEach((user) => {
    const { email,'warranty period':warrantyPeriod,'released year':releasedYear } = user;

    if (warrantyPeriod && releasedYear && email) {
      const expiryDate = calculateWarrantyExpiry(releasedYear, warrantyPeriod); // Calculate the expiry date

      // Calculate days remaining until warranty expiry
      const timeDifference = expiryDate.getTime() - currentDate.getTime();
      const daysRemaining = timeDifference / (1000 * 3600 * 24);

      if (daysRemaining <= 30 && daysRemaining >= 0) { // If warranty expires within 30 days
        const message = `Your warranty for the device released in ${releasedYear} is about to expire on ${expiryDate.toLocaleDateString()}. Please take necessary action.`;
        sendEmailNotification(email, 'Warranty Expiry Reminder', message); // Send email notification
      }
    }
  });
};
