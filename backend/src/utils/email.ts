export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  console.log('[MOCK EMAIL SENT]');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Text:', text);
};
