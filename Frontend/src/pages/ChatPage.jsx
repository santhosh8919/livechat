import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || "93yh7mp8uy5c";

const ChatPage = () => {
  const { id: friendId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser, isLoading: authLoading } = useAuthUser();

  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      // Wait for auth and token to be ready
      if (authLoading || tokenLoading) return;

      if (!authUser) {
        setError("Please log in to access chat");
        setLoading(false);
        return;
      }

      if (!tokenData?.token) {
        setError(
          "Failed to get chat token. Please check your Stream API configuration."
        );
        setLoading(false);
        return;
      }

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // Create or get the channel between the two users
        const channelId = [authUser._id, friendId].sort().join("-");
        const newChannel = client.channel("messaging", channelId, {
          members: [authUser._id, friendId],
        });

        await newChannel.watch();

        setChatClient(client);
        setChannel(newChannel);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setError(error.message || "Failed to initialize chat");
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, friendId, authLoading, tokenLoading]);

  if (loading || authLoading || tokenLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !chatClient || !channel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg">Unable to load chat</p>
          <p className="text-sm opacity-70">
            {error || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
