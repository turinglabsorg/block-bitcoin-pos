export const getAccountActivationEmail = (params: {
  platform_url: string;
  token: string;
  email: string;
}) => `Hello,<br><br>

Your account on the BlockPOS platform has been successfully created.<br>
To complete the activation and access the platform enter the following code:<br><br>

<h2>${params.token}</h2><br><br>

Or use the following link:<br>
<a href='${params.platform_url}/activate?token=${params.token}&email=${params.email}'>Enter the platform</a><br><br>

If you did not request the token or if you need assistance, you can contact our support at: hello@blockpos.xyz<br><br>

Best regards,<br>
The BlockPOS Team`;
