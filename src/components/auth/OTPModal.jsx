import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import { useNotificationContext } from "@/app/context/ShowNotification";
import api from "@/services/api";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useGlobalContext } from "@/app/context/GlobalContext";

const schema = Yup.object().shape({
  otp: Yup.array()
    .of(
      Yup.string()
        .matches(/^\d$/, "Each digit must be a number")
        .required("Required")
    )
    .min(4, "All digits are required")
    .max(4, "Only 4 digits allowed"),
});

const OTPModal = ({ onSwitchTo, email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);  // start at 60 s
  const { showNotification } = useNotificationContext();
  const { setAuthEmail } = useGlobalContext();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      otp: ["", "", "", ""],
    },
    resolver: yupResolver(schema),
  });





  const handleVerifyOTP = handleSubmit(async ({ otp }) => {
    const code = otp.join("");

    try {
      setIsLoading(true);
      const res = await api.post("/api/Account/VerifyOTP", {
        email,
        code,
      });

      if (res?.status === 200 && res?.data?.isSuccess) {
        showNotification({
          message: res?.data?.message || "OTP verified successfully!",
          variant: "success",
        });
        onSwitchTo("set-new-password");
      } else {
        showNotification({
          message: res?.data?.message || "Invalid OTP.",
          variant: "error",
        });
      }
    } catch (error) {
      showNotification({
        message: error?.response?.data?.message || "Something went wrong.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  });
  const handleResendOTP = async () => {
    if (resendTimer > 0 || isResending) return;
    try {
      setIsResending(true);
      const res = await api.post("/api/Account/GenerateOTP", { email });

      if (res?.status === 200 && res?.data?.isSuccess) {
        showNotification({ message: res.data.message, variant: "success" });
        setResendTimer(60);
      } else {
        showNotification({ message: res.data.message, variant: "error" });
        setResendTimer(60);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showNotification({
        message: error?.response?.data?.message || "Failed to send OTP",
        variant: "error",
      });
    } finally {
      setIsResending(false);
    }
  }


  useEffect(() => {
    if (resendTimer === 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  return (
    <div className="flex flex-col items-center py-8 gap-10 px-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center mb-5 text-black">
        <h1 className="text-2xl font-semibold">Enter OTP Code</h1>
        <p className="">
          We sent a code to <span className="text-primary font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="flex flex-col items-center w-full gap-4">
        <div className="flex justify-between gap-2 mb-4 w-full">
          {[0, 1, 2, 3].map((index) => (
            <Controller
              key={index}
              name={`otp[${index}]`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d$/.test(val) || val === "") {
                      field.onChange(val);
                    }
                  }}
                />
              )}
            />
          ))}
        </div>
        {errors.otp && (
          <p className="text-sm text-primary text-center -mt-2">{errors.otp.message}</p>
        )}

        <div className="flex flex-col gap-2 items-center">
          <p className="text-sm text-center text-muted-foreground mb-2">
            Didn’t receive the code?{" "}
            <span
              onClick={handleResendOTP}
              className={`font-medium ${resendTimer > 0 || isResending
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary cursor-pointer hover:underline"
                }`}
            >
              {isResending
                ? "Resending..."
                : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend code"}
            </span>
          </p>

          <p
            className="text-sm text-muted-foreground mb-4 cursor-pointer hover:underline"
            onClick={() => onSwitchTo("login")}
          >
            ← Back to login
          </p>
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
              Continue <BsArrowRight />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default OTPModal;
