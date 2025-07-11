import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { BsArrowRight } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import api from "@/services/api";
import { useNotificationContext } from "@/app/context/ShowNotification";
import { useState } from "react";
import Image from "next/image";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Invalid email address")
    .required("Email is required"),
});

const ForgotPasswordModal = ({ onSwitchTo, setAuthEmail }) => {
  const { showNotification } = useNotificationContext();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateOTP = handleSubmit(async ({ email }) => {
    try {
      setIsLoading(true);
      const res = await api.post("/api/Account/GenerateOTP", { email });

      if (res?.status === 200 && res?.data?.isSuccess) {
        showNotification({ message: res.data.message, variant: "success" });
        setAuthEmail(email);
        onSwitchTo("OTP");
      } else {
        showNotification({ message: res.data.message, variant: "error" });
      }
    } catch (error) {
      showNotification({
        message: error?.response?.data?.message || "Failed to send OTP",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={handleGenerateOTP} className="flex flex-col items-center gap-6 py-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center mb-5 text-black">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="">We will send an OTP code to your email for the next steps.</p>
      </div>
      <div className="grid gap-2 w-full">
        <Label htmlFor="email" className="font-semibold">Email Address</Label>
        <div className="relative flex items-center">
          <span className="absolute left-2">
            <Image src="/icons/sms.svg" alt="Email" width={18} height={18} />
          </span>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="ps-8"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-2 flex justify-center items-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Send OTP
          </>
        )}
      </Button>

      {/* <p className="text-center mt-2">
        Switch to{" "}
        <span
          className="text-primary font-semibold cursor-pointer"
          onClick={() => onSwitchTo("OTP")}
        >
          OTP
        </span>
      </p> */}
    </form>
  );
};

export default ForgotPasswordModal;
