export const getAccountActivationEmail = (params: {
  platform_url: string;
  token: string;
  email: string;
}) => `Hello,<br><br>

Your account on the BlockPOS platform has been successfully created. To complete the activation and access the platform, we ask you to set a secure password.<br><br>

To begin, click on the link below:<br>
<a href='${params.platform_url}/activate?token=${params.token}&email=${params.email}'>Activate your account</a><br><br>

This link is valid for 48 hours and will redirect you to a secure page where you can set your password. Please follow these password security criteria:<br>
• Minimum 8 characters<br>
• At least one uppercase letter<br>
• At least one number<br>
• At least one special character<br><br>

If you did not request the creation of this account or if you need assistance, you can contact our support at: hello@blockpos.xyz<br><br>

Thank you for your cooperation!<br><br>

Best regards,<br>
The BlockPOS Team`;
