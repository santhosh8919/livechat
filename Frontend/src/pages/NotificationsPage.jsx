import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFriendRequests, acceptFriendRequest } from "../lib/api";
import { BellIcon, CheckIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { LANGUAGE_TO_FLAG } from "../constants";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to accept request");
    },
  });

  const getFlagEmoji = (language) => {
    if (!language) return null;
    const countryCode = LANGUAGE_TO_FLAG[language.toLowerCase()];
    if (!countryCode) return null;
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={language}
        className="inline-block h-3 mr-1"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const incomingReqs = data?.incomingReqs || [];
  const acceptedReqs = data?.acceptedReqs || [];

  const hasNotifications = incomingReqs.length > 0 || acceptedReqs.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="size-6 text-primary" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {!hasNotifications ? (
          <NoNotificationsFound />
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingReqs.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
                <div className="space-y-3">
                  {incomingReqs.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4 flex-row items-center gap-4">
                        <div className="avatar">
                          <div className="w-14 rounded-full">
                            <img
                              src={request.sender.profilePic}
                              alt={request.sender.fullName}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">
                            {request.sender.fullName}
                          </h3>
                          <p className="text-sm opacity-70">
                            {getFlagEmoji(request.sender.nativeLanguage)}
                            {request.sender.nativeLanguage} →{" "}
                            {getFlagEmoji(request.sender.learningLanguage)}
                            {request.sender.learningLanguage}
                          </p>
                        </div>
                        <button
                          className="btn btn-primary btn-sm gap-1"
                          onClick={() => acceptMutation(request._id)}
                          disabled={isPending}>
                          {isPending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <CheckIcon className="size-4" />
                              Accept
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Friend Requests (your sent requests that were accepted) */}
            {acceptedReqs.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">
                  Accepted Requests
                </h2>
                <div className="space-y-3">
                  {acceptedReqs.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4 flex-row items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img
                              src={request.recipient.profilePic}
                              alt={request.recipient.fullName}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {request.recipient.fullName}
                            </span>{" "}
                            accepted your friend request!
                          </p>
                        </div>
                        <CheckIcon className="size-5 text-success" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
