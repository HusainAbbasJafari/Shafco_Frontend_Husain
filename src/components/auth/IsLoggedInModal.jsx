import { Button } from "../ui/button";
import { IoLogInOutline } from "react-icons/io5";
import { useNotificationContext } from "@/app/context/ShowNotification";

const IsLoggedInModal = ({ setOpenAuthModal, onSwitchTo }) => {
  const { showNotification } = useNotificationContext();

  const handleSwitch = (mode) => {
    setOpenAuthModal(true);
    onSwitchTo(mode);
    showNotification({
      message: `Please ${mode === "login" ? "log in" : "sign up"} to continue.`,
      variant: "info",
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10 px-6">
      <IoLogInOutline className="text-blue-600" size={60} />
      <h1 className="text-2xl font-semibold text-center">Are you logged in?</h1>
      <p className="text-center">
        You're not logged in. Please log in or sign up to continue.
      </p>

      <div className="flex w-full gap-4 mt-2">
        <Button
          variant="outline"
          onClick={() => handleSwitch("signup")}
          className="w-1/2"
        >
          Sign Up
        </Button>

        <Button
          onClick={() => handleSwitch("login")}
          className="w-1/2 bg-blue-600 hover:bg-blue-700"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default IsLoggedInModal;
