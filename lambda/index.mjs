import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const { name, email, service, message } = body;

  await ses.send(new SendEmailCommand({
    Source: process.env.FROM_EMAIL,
    Destination: { ToAddresses: [process.env.TO_EMAIL] },
    ReplyToAddresses: [body.email],
    Message: {
      Subject: { Data: `New inquiry from ${body.name}` },
      Body: {
        Text: {
          Data: `Name: ${body.name}\nEmail: ${body.email}\nService: ${body.service}\nMessage: ${body.message}`
        }
      }
    }
  }));

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ success: true }),
  };
};