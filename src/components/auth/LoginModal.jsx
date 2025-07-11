import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BiLogoFacebook } from "react-icons/bi";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "@/services/api";
import { useNotificationContext } from "@/app/context/ShowNotification";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginModal = ({ onSwitchTo, setOpenAuthModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotificationContext();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const handleLogin = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const res = await api.post("api/Account/LoginUser", formData);
      const responseData = res?.data;
      if (responseData?.isSuccess) {
        showNotification({
          message: responseData.message || "Login successful",
          variant: "success"
        });
        const token = responseData?.token;
        const user = { token, ...responseData?.data };
        dispatch(login(user));
        setOpenAuthModal(false);
        router.push("/");
      } else {
        showNotification({
          message: responseData?.message || "Login failed",
          variant: "error"
        });
      }

    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong during login";

      showNotification({
        message: errorMsg,
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="">
      <div className="flex  flex-col items-center text-black">
        <h1 className="text-2xl font-semibold mb-2">Sign In</h1>
        <p className="">Let's experience the joy of ShafcoLink</p>
      </div>

      <form onSubmit={handleLogin} className="grid w-full gap-4 mt-8">
        <div className="grid gap-2">
          <Label htmlFor="email" className="font-semibold">Email Address</Label>
          <div className="relative flex items-center">
            <span className="absolute left-2">
              <Image src="/icons/sms.svg" alt="User" width={18} height={18} />
            </span>
            <Input
              className="ps-8"
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="new-email"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* <div className="grid gap-2">
          <Label htmlFor="password" className="font-semibold">Password</Label>
          <div className="relative flex items-center">
            <span className="absolute left-2">
              <MdLockOutline size={20} />
            </span>
            <Input
              className="ps-8"
              type="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div> */}
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

        <div onClick={() => onSwitchTo('forgot-password')} className="text-right text-sm text-primary font-semibold hover:underline cursor-pointer -mt-2">
          Forgot password?
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
              Sign In <BsArrowRight />
            </>
          )}
        </Button>
      </form>

      <div className="flex items-center gap-2 mt-4 text-black">
        <hr className="flex-grow border-t border-black" />
        <span className="text-sm">Or Login With</span>
        <hr className="flex-grow border-t border-black" />
      </div>

      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="h-8 w-8 rounded-md border border-gray-300 hover:border-primary transition-colors flex items-center justify-center">
          <BiLogoFacebook size={25} />
        </div>
        <div className="h-8 w-8 rounded-md border border-gray-300 hover:border-primary transition-colors flex items-center justify-center">
          <FaGoogle size={20} />
        </div>
      </div>

      <div className="text-center text-sm mt-2 font-semibold">
        Don't have an account?{" "}
        <span onClick={() => onSwitchTo('signup')} className="text-primary font-semibold cursor-pointer hover:underline">
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default LoginModal;
