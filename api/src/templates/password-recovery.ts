export const getPasswordRecoveryEmail = (params: {
  platform_url: string;
  token: string;
  email: string;
}) => `Hello,<br><br>

We have received a request to reset your password for your account.<br><br>

To reset your password, click on the link below:<br>
<a href='${params.platform_url}/password-recover?token=${params.token}&email=${params.email}'>Reset password</a><br><br>

If you did not request the password reset, you can ignore this email.<br><br>

Best regards,<br>
The BlockPOS Team`;
