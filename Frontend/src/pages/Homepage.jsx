import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
  getUserFriends,
} from "../lib/api";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { LANGUAGE_TO_FLAG } from "../constants";

const Homepage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: outgoingReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    onSuccess: (data) => {
      const ids = new Set(data.map((req) => req.recipient._id));
      setOutgoingRequestsIds(ids);
    },
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success("Friend request sent!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  const handleSendRequest = (userId) => {
    setOutgoingRequestsIds((prev) => new Set([...prev, userId]));
    sendRequestMutation(userId);
  };

  const getFlagEmoji = (language) => {
    if (!language) return "🌍";
    const countryCode = LANGUAGE_TO_FLAG[language.toLowerCase()];
    if (!countryCode) return "🌍";
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={language}
        className="inline-block h-4 mr-1"
      />
    );
  };

  if (loadingUsers || loadingFriends) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Friends Section */}
        {friends.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UsersIcon className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Friends</h2>
              </div>
              <Link to="/friends" className="btn btn-sm btn-ghost">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.slice(0, 4).map((friend) => (
                <div key={friend._id} className="card bg-base-200 shadow-sm">
                  <div className="card-body p-4 flex-row items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={friend.profilePic} alt={friend.fullName} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {friend.fullName}
                      </h3>
                      <p className="text-sm opacity-70">
                        {getFlagEmoji(friend.nativeLanguage)}{" "}
                        {friend.nativeLanguage}
                      </p>
                    </div>
                    <Link
                      to={`/chat/${friend._id}`}
                      className="btn btn-primary btn-sm">
                      Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Users Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <UserPlusIcon className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">
              Recommended Language Partners
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12 bg-base-200 rounded-lg">
              <UsersIcon className="size-12 mx-auto opacity-50 mb-4" />
              <h3 className="text-lg font-medium">No recommendations yet</h3>
              <p className="text-sm opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => {
                const hasRequestPending = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="avatar">
                          <div className="w-14 rounded-full">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <p className="text-xs opacity-70 flex items-center gap-1">
                              <MapPinIcon className="size-3" />
                              {user.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-sm">
                        <p>
                          <span className="opacity-70">Native:</span>{" "}
                          {getFlagEmoji(user.nativeLanguage)}{" "}
                          {user.nativeLanguage}
                        </p>
                        <p>
                          <span className="opacity-70">Learning:</span>{" "}
                          {getFlagEmoji(user.learningLanguage)}{" "}
                          {user.learningLanguage}
                        </p>
                      </div>

                      {user.bio && (
                        <p className="text-xs opacity-70 mt-2 line-clamp-2">
                          {user.bio}
                        </p>
                      )}

                      <button
                        className={`btn btn-sm mt-3 w-full ${
                          hasRequestPending ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => handleSendRequest(user._id)}
                        disabled={hasRequestPending || isPending}>
                        {hasRequestPending ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            Add Friend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Homepage;
