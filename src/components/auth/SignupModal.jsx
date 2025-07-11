import { BsArrowRight } from "react-icons/bs";
import { MdLockOutline, MdOutlineEmail, MdOutlinePerson } from "react-icons/md";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import api from "@/services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNotificationContext } from "@/app/context/ShowNotification";
import { useRoleList } from "@/services/general";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FaRegEyeSlash, FaRegEye, FaRegUser } from "react-icons/fa";
import Image from "next/image";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  roleId: Yup.string().required("Please select a role"),
});

const SignupModal = ({ onSwitchTo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showNotification } = useNotificationContext();
  const router = useRouter();
  const { data: roleList } = useRoleList(router);
  const queryClient = useQueryClient();
  const { register, setValue, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    queryClient.invalidateQueries(['roleList']);
  }, []);


  const handleSignUp = handleSubmit(async (data) => {

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('roleId', data.roleId);
      formData.append('hashPassword', data.password);
      formData.append('email', data.email);
      formData.append('name', data.name);
      const res = await api.post('api/Account/RegisterUser', formData)
      if (res?.status === 200 && res?.data?.isSuccess === true) {
        showNotification({
          message: res?.data?.message,
          variant: "success",
        });

        onSwitchTo("login");

      } else {
        showNotification({
          message: res?.data?.message,
          variant: "error",
        });
      }
    } catch (error) {
      showNotification({
        message: error?.response?.data?.message || "Error occurred while creating the bundle.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  });


  return (
    <div className="">
      <div className="flex flex-col items-center mb-5 text-black">
        <h1 className="text-2xl font-semibold">Create New Account</h1>
        {/* <p className="text-sm ">Join Shafco for seamless healthcare AI</p> */}
      </div>

      <div className="grid w-full gap-4">
        <form onSubmit={handleSignUp} className="grid w-full gap-4">

          <div className="grid gap-2">
            <Label htmlFor="roleId" className="font-semibold">RoleIDs</Label>
            <div className="relative">
              <select
                id="roleId"
                className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("roleId")}
              >
                <option value="">Select a role</option>
                {roleList?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
            {errors.roleId && <p className="text-sm text-red-500">{errors.roleId.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="font-semibold">Name</Label>
            <div className="relative flex items-center">
              <span className="absolute left-2">

                <Image src="/icons/profile.svg" alt="User" width={18} height={18} />
              </span>
              <Input
                type="text"
                id="name"
                className="ps-8"
                placeholder="Enter your name"
                autoComplete="name"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 ">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold">Email Address</Label>
            <div className="relative flex items-center">
              <span className="absolute left-2">
                <Image src="/icons/sms.svg" alt="email" width={18} height={18} />
              </span>
              <Input className="ps-8" type="email" id="email" placeholder="Enter your email" autoComplete="new-email" {...register("email")} />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

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



          <Button
            type="submit"
            className="w-full mt-2 flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign Up <BsArrowRight />
              </>
            )}
          </Button>
        </form>
        {/* <div className="flex items-center gap-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-sm text-muted-foreground">Or Sign Up With</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div> */}
        <div className="text-center text-sm mt-2 font-semibold">
          Already have an account?{" "}
          <span onClick={() => onSwitchTo("login")} className="text-primary font-semibold cursor-pointer hover:underline">
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
