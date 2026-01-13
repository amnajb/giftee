/**
 * Email Service
 * Handles sending emails (stub implementation)
 */

const sendEmail = async ({ to, subject, html }) => {
  // In production, integrate with SendGrid, AWS SES, or similar
  console.log(`📧 Email would be sent to: ${to}`);
  console.log(`   Subject: ${subject}`);
  
  // Return success for now
  return { success: true, messageId: `mock-${Date.now()}` };
};

module.exports = { sendEmail };
