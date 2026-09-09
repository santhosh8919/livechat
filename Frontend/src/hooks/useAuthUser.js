import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
  });

  return { isLoading: authQuery.isLoading, authUser: authQuery.data?.user };
};
export default useAuthUser;
