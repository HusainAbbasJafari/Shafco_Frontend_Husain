'use client'

import EditProfile from "@/components/custom-ui/EditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalContext } from "../context/GlobalContext";
import SetNewPasswordModal from "@/components/auth/SetNewPasswordModal";
import api from "@/services/api";
import { useNotificationContext } from "../context/ShowNotification";
import { handleError } from "@/utility/handleError";
import { useRouter } from "next/navigation";
import { persistor } from "@/store/store";
import { logout } from "@/store/slices/authSlice";


export default function UserProfile() {
    const tg = useTranslations('general');
    const [isEditProfile, setIsEditProfile] = useState(false);
    const router = useRouter();
    const { showNotification } = useNotificationContext();
    const { user } = useSelector((state) => state.auth);
    const { authType, setAuthType, openAuthModal, setOpenAuthModal } = useGlobalContext();
    const dispatch = useDispatch();
    const handleChangePassword = () => {
        setAuthType("set-new-password");
        setOpenAuthModal(true);
    }
    const handleDeleteAccount = async () => {
        try {
            const response = await api.post('/api/Account/DeleteAccount', { email: user?.email })
            if (response?.data?.isSuccess && response?.data?.statusCode === 200) {
                showNotification({
                    message: response?.data?.message,
                    variant: 'success',
                });

                if (router) {
                    router.push('/');
                }
            } else {
                if (router && response?.data?.statusCode !== 200) {
                    handleError(res.data.statusCode, router);
                }
                showNotification({
                    message: response?.data?.message || "Failed to delete account",
                    variant: 'error',
                });
            }
        } catch (err) {
            if (router) {
                handleError(err?.response?.status, router);
            }
            showNotification({
                message: err?.response?.data?.message || 'Something went wrong',
                variant: 'error',
            })
        } finally {
            dispatch(logout());
            persistor.purge();
            delete api.defaults.headers.common["Authorization"];
        }
    }

    return (
        <section className="py-8">
            <div className="container">
                <h4 className="font-bold text-2xl mb-6">{tg('profileDetails')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-6 gap-4">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <Card className="border-primary text-center px-4 lg:px-6">
                            <div className="flex flex-col items-center">
                                <Avatar className="w-24 h-24 border-1 border-primary p-1">
                                    <AvatarImage className="w-full h-full rounded-full" src={user?.profilePic || "https://randomuser.me/api/portraits/men/1.jpg"} alt="Profile" />
                                    <AvatarFallback className="font-semibold text-xl">{user?.fullName?.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-lg font-semibold mt-4">{user?.fullName}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>

                                {isEditProfile ? null : (
                                    <Button onClick={() => setIsEditProfile(true)} variant="link" className="text-primary mt-1 text-sm px-0">
                                        {tg('editProfile')}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="col-span-1 sm:col-span-3 lg:col-span-4">
                        <Card className="!py-4 px-4 lg:px-6 h-full">
                            {isEditProfile ? (
                                <EditProfile isEditProfile={isEditProfile} setIsEditProfile={setIsEditProfile} />
                            ) : (
                                <div>
                                    <h5 className="font-semibold text-xl mb-6">{tg('personalDetails')}</h5>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-100 rounded-md">
                                                <Phone className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone Number</p>
                                                <p className="font-medium">{user?.phoneNumber}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-100 rounded-md">
                                                <User className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-medium">{user?.gender}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-100 rounded-md">
                                                <Calendar className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Date of Birth</p>
                                                <p className="font-medium">{user?.dateOfBirth}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-4 flex-wrap w-fit">
                                        <Button onClick={handleChangePassword} variant="outline" className="flex-1">
                                            Change Password
                                        </Button>
                                        <Button onClick={handleDeleteAccount} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                                            Delete Account
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </section>



    )
}
