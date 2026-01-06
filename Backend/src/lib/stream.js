import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

let streamClient = null;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
} else {
  try {
    streamClient = StreamChat.getInstance(apiKey, apiSecret);
  } catch (error) {
    console.error("Error initializing Stream client:", error.message);
  }
}

export const upsertStreamUser = async (userData) => {
  if (!streamClient) {
    console.log("Stream client not initialized, skipping user creation");
    return userData;
  }
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error creating Stream user", error);
    return userData;
  }
};

export const generateStreamToken = (userId) => {
  if (!streamClient) {
    console.error("Stream client not initialized");
    return null;
  }
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return null;
  }
};
