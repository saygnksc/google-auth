export default async function handler(req, res) {
  const { google } = require('googleapis');

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/google-callback`
  );

  if (!req.query.code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    res.status(200).json({
      message: "Google Login successful",
      user: data,
      tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving access token" });
  }
}
