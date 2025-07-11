import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MdLockOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "@/services/api";
import { useNotificationContext } from "@/app/context/ShowNotification";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Image from "next/image";

const schema = Yup.object().shape({
  password: Yup.string().required("Password is required").min(6, "Minimum 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const SetNewPasswordModal = ({ onSwitchTo, email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotificationContext();
  const { user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleNewPassword = handleSubmit(async ({ password }) => {
    try {
      setIsLoading(true);
      const res = await api.post("/api/Account/ForgetPassword", {
        email,
        password,
      });

      if (res?.status === 200 && res?.data?.isSuccess) {
        showNotification({ message: res.data.message, variant: "success" });
        onSwitchTo("success");
      } else {
        showNotification({ message: res?.data?.message || "Failed to reset password", variant: "error" });
      }
    } catch (error) {
      showNotification({
        message: error?.response?.data?.message || "Something went wrong",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={handleNewPassword} className="flex flex-col items-center gap-6 py-10 w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-2 text-center">Set New Password</h1>

      <div className="grid w-full gap-4">
        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password" className="font-semibold">Password</Label>
          <div className="relative flex items-center">
            {/* Lock icon on the left */}
            <span className="absolute left-2 text-gray-600">
              <Image src="/icons/lock.svg" alt="Password" width={18} height={18} />
            </span>

            {/* Eye icon on the right */}
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 cursor-pointer text-gray-600"
            >
              {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
            </span>

            <Input
              className="ps-8 pr-10"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>



        <div className="grid gap-2">
          <Label htmlFor="confirm-password" className="font-semibold">Confirm Password</Label>
          <div className="relative flex items-center">
            {/* Lock icon on the left */}
            <span className="absolute left-2 text-gray-600">
              <Image src="/icons/lock.svg" alt="Password" width={18} height={18} />
            </span>

            {/* Eye icon on the right */}
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 cursor-pointer text-gray-600"
            >
              {showConfirmPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
            </span>

            <Input
              className="ps-8"
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}

          {/* Back to login */}
          {!user && (

            <p
              className="text-center mt-1 text-sm font-medium cursor-pointer hover:underline"
              onClick={() => onSwitchTo("login")}
            >
              ← Back to login
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-2 flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Reset Password <BsArrowRight />
              </>
            )}
          </Button>
        </div>


      </div>
    </form>
  );
};

export default SetNewPasswordModal;
