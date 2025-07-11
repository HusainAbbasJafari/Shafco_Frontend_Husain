'use client'

import { use, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pencil } from 'lucide-react'
import { MdOutlineEmail } from 'react-icons/md'
import { DatePicker } from './DatePicker'
import { PhoneInput } from './PhoneInput'
import api from '@/services/api'

import { useTranslations } from 'next-intl'
import { useNotificationContext } from '@/app/context/ShowNotification'
import { useQueryClient } from '@tanstack/react-query'
import parsePhoneNumberFromString from 'libphonenumber-js'


const schema = Yup.object().shape({
    fullName: Yup.string().trim().required('Full Name is required').max(100, 'Full Name cannot exceed 100 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
})

export default function EditProfile({ isEditProfile, setIsEditProfile }) {
    const queryClient = useQueryClient()
    const tg = useTranslations('general')
    const { showNotification } = useNotificationContext()
    const user = useSelector(state => state.auth.user)

    const [dobValue, setDobValue] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')
    const [countryCode, setCountryCode] = useState('62')
    const [defaultCountry, setDefaultCountry] = useState('ID')

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: '',
            email: '',
        }
    })

    useEffect(() => {
        if (isEditProfile) {
            if (user && user.userId) {
                setValue('fullName', user.fullName || '');
                setValue('email', user.email || '');
                setPhone(user.phoneNumber || '');
                setGender(user.gender || '');
                setDobValue(user.dateOfBirth || '');
                setProfileImage(user.profilePic || '');
                // setCountryCode(user.countryCode || '');

                const parsed = parsePhoneNumberFromString(user.phoneNumber || '');
                if (parsed) {
                    setCountryCode(parsed.countryCallingCode);
                    setDefaultCountry(parsed.country);
                } else {
                    setCountryCode('');
                    setDefaultCountry('ID');
                }
            }
        }
    }, [isEditProfile, setValue]);



    const onSubmit = async (data) => {
        const formData = new FormData()
        formData.append('Id', user?.userId || null)
        formData.append('FullName', data.fullName)
        formData.append('Email', data.email)
        formData.append('Gender', gender || '')
        formData.append('PhoneNumber', phone || '')
        formData.append('CountryCode', countryCode || '')
        formData.append('DateOfBirth', dobValue || '')

        if (imageFile) {
            formData.append('Profilepic', imageFile)
        } else {
            formData.append('Profilepic', '')
        }

        // Optional fields with empty values
        const optionalFields = [
            'Address', 'Location', 'Nationality', 'BloodGroup', 'MaritalStatus',
            'Occupation', 'BonusPointsBalance', 'RewardPointsBalance',
            'RecentActivitySummary', 'SecondAddress', 'LandMark', 'ZipCode',
            'CountryId', 'StateId', 'CityId'
        ]
        optionalFields.forEach(key => formData.append(key, ''))
        try {
            const res = await api.post('/api/Account/Updateprofile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (res?.data?.isSuccess) {
                showNotification?.({
                    variant: 'success',
                    message: res.data.message || 'Profile updated successfully!'
                })
                setIsEditProfile(false)
            } else {
                showNotification?.({
                    variant: 'danger',
                    message: res?.data?.message || 'Profile update failed.'
                })
            }
        } catch (error) {
            showNotification?.({
                variant: 'danger',
                message: error?.response?.data?.message || 'Something went wrong.'
            })
        } finally {
            queryClient.invalidateQueries(['loggedInUser'])
        }
    }

    const handleImageChange = (file) => {
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => setProfileImage(reader.result)
        reader.readAsDataURL(file)
        setImageFile(file)
    }

    const handleCancel = () => {
        setProfileImage('')
        setIsEditProfile(false)
    }

    return (
        <>
            <h4 className="font-bold text-xl mb-6">{tg('editProfile')}</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <Label className="font-semibold relative cursor-pointer" htmlFor="profileImage">
                        <Avatar className="w-24 h-24 border-1 border-primary p-1">
                            <AvatarImage className="w-full h-full rounded-full" src={profileImage} />
                            <AvatarFallback className="font-semibold text-xl">
                                {user?.fullName?.slice(0, 2).toUpperCase() || 'AB'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="absolute bottom-1 right-0 bg-primary rounded-full p-[6px] cursor-pointer">
                            <Pencil className="text-white w-4 h-4" />
                        </div>

                        <Input
                            type="file"
                            hidden
                            id="profileImage"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                        />
                    </Label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="col-span-1">
                        <div className="grid gap-2">
                            <Label className="font-semibold" htmlFor="fullName">Name</Label>
                            <Input id="fullName" placeholder="Enter full name" {...register('fullName')} />
                        </div>
                        {errors.fullName && <p className="text-primary text-sm">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="col-span-1">
                        <div className="grid gap-2">
                            <Label className="font-semibold" htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <MdOutlineEmail size={20} className="absolute left-2 top-2.5 text-gray-500" />
                                <Input id="email" type="email" className="ps-8" placeholder="Enter email" {...register('email')} disabled />
                            </div>
                        </div>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="col-span-1">
                        <div className="grid gap-2">
                            <Label className="font-semibold">Phone Number</Label>
                            <PhoneInput
                                value={phone}
                                className="text-black font-semibold"
                                onChange={(val) => {
                                    setPhone(val || '');
                                    const parsed = parsePhoneNumberFromString(val || '');
                                    if (parsed) {
                                        setCountryCode(parsed.countryCallingCode);
                                    } else {
                                        setCountryCode('');
                                    }
                                }}
                                defaultCountry={defaultCountry}
                                international
                                countryCallingCodeEditable={false}
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="col-span-1">
                        <div className="grid gap-2">
                            <Label htmlFor="gender" className="font-semibold">
                                Gender
                            </Label>

                            <Select
                                value={gender || user?.gender || ""}
                                onValueChange={(val) => setGender(val)}
                            >
                                {/* selected value shows up bold */}
                                <SelectTrigger className="w-full !h-[40px] font-semibold">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>

                                <SelectContent>
                                    {/* dropdown items show up bold */}
                                    <SelectItem value="Male" className="font-semibold">
                                        Male
                                    </SelectItem>
                                    <SelectItem value="Female" className="font-semibold">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="Other" className="font-semibold">
                                        Other
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* DOB */}
                    <div className="col-span-1">
                        <div className="grid gap-2 text-black font-semibold">
                            <Label className="font-semibold">Date of Birth</Label>
                            <DatePicker datePickerValue={dobValue} setDatePickerValue={setDobValue} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" className="bg-primary text-white px-5">
                        {tg('saveDetails')}
                    </Button>
                    <Button type="button" variant="secondary" className="px-5" onClick={handleCancel}>
                        {tg('cancel')}
                    </Button>
                </div>
            </form>
        </>
    )
}
