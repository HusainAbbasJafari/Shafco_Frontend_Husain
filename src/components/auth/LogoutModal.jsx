import { Button } from "../ui/button";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/services/api";
import { persistor } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useNotificationContext } from "@/app/context/ShowNotification";
  
const LogoutModal = ({ setOpenAuthModal, onSwitchTo, setProfileDropdown }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotificationContext();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = async () => {

        try {
            const res = await api.post("api/Account/Logout");
            if (res?.data?.isSuccess) {
                showNotification({
                    message: res.data.message || "Logged out successfully",
                    variant: "success",
                });
            } else {
                showNotification({
                    message: res?.data?.message || "Server logout failed",
                    variant: "warning",
                });
            }
        } catch (error) {
            //  handle token expiry
            if (error.response?.status === 401) {
                showNotification({
                    message: "Session expired. Logging out locally.",
                    variant: "info",
                });
            } else {
                showNotification({
                    message: "Logout failed. Try again.",
                    variant: "error",
                });
            }
        } finally {
            dispatch(logout());
            persistor.purge();
            delete api.defaults.headers.common["Authorization"];
            setIsLoading(false);
            setOpenAuthModal(false);
            setProfileDropdown(false);
        }
    };
    

    return (
         <div className="flex flex-col items-center gap-6 py-10 px-6">
    <h1 className="text-2xl font-semibold text-center">Log Out</h1>

    <p className="text-sm text-black text-center">
      Are you sure you want to log out?
    </p>

    {/* Separator */}
    <div className="w-full h-[0.5px] bg-black/50 my-2" />

    <div className="flex w-full gap-4 mt-2">
      <Button
        variant="outline"
        onClick={() => setOpenAuthModal(false)}
        className="grow"
      >
        Cancel
      </Button>

      <Button
        onClick={handleLogout}
        className="grow bg-red-600 hover:bg-red-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Yes, Logout"
        )}
      </Button>
    </div>
  </div>
    );
};

export default LogoutModal;
