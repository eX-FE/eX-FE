// Simple placeholder – replace with nodemailer or a provider later
async function sendEmail({ to, subject, html }) {
  console.log('[Email stub]', { to, subject });
  return true;
}

module.exports = { sendEmail };