'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from 'next-intl';
import { toast } from 'sonner'; // Sonner import
import { submitLeadForm } from '@/services/api';
import Loader from './Loader';

export default function GetQuoteForm({ expanded, setExpanded, development, resaleProperty }) {

    const tg = useTranslations('general');
    const tf = useTranslations('form');

    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");

    if (loading) return <Loader message="Fetching data..." />;

    const validateEmail = (email) => {
        // Regular expression for a valid email address
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Trim all values
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedNumber = number.trim();
        const trimmedMessage = message.trim();

        // Validate trimmed values
        if (
            !trimmedFirstName ||
            !trimmedLastName ||
            !trimmedEmail ||
            !trimmedNumber ||
            !trimmedMessage
        ) {
            toast.error("Please fill out all fields", {
                description: "Fields cannot be empty or just spaces.",
            });
            setTimeout(() => {
                setLoading(false);
            }, 100);
            return;
        }

        // Validate email format
        if (!validateEmail(trimmedEmail)) {
            toast.error("Invalid email address", {
                description: "Please enter a valid email address.",
            });
            setTimeout(() => {
                setLoading(false);
            }, 100);
            return;
        }

        try {

            const formData = {
                first_name: trimmedFirstName,
                last_name: trimmedLastName,
                phone_number: trimmedNumber,
                email: trimmedEmail,
                comment: trimmedMessage,
                development_uuid: development || null,
                resale_property_uuid: resaleProperty || null
            };

            const res = await submitLeadForm(formData);
            if (res && res.success === true) {
                toast.success("Request submitted!", {
                    description: "We'll get back to you shortly.",
                });

                setExpanded(false);
                setFirstName("");
                setLastName("");
                setEmail("");
                setNumber("");
                setMessage("");
            } else {
                const errorsMsg = res?.response?.data?.errors;

                toast.error(res?.response?.data?.message || "Submission failed", {
                    description: errorsMsg.firstName || errorsMsg.lastName || errorsMsg.email || errorsMsg.number || errorsMsg.message || "Something went wrong."
                });
            }

            setTimeout(() => {
                setLoading(false);
            }, 100);

        } catch (error) {
            toast.error("Submission failed", {
                description: error?.response?.data?.message || "Something went wrong.",
                action: {
                    label: "Retry",
                    onClick: handleSubmit,
                },
            });

            setTimeout(() => {
                setLoading(false);
            }, 100);
        }
    };

    return (
        <Dialog open={expanded} onOpenChange={setExpanded}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tg("getQuote")}</DialogTitle>
                    <DialogDescription>
                        {tg("getQuoteDesc")}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-6 items-center gap-4">
                        <Label htmlFor="firstName" className="col-span-1 sm:col-span-2">
                            {tf("label1")}
                        </Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="col-span-1 sm:col-span-4"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-6 items-center gap-4">
                        <Label htmlFor="lastName" className="col-span-1 sm:col-span-2">
                            {tf("surname")}
                        </Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="col-span-1 sm:col-span-4"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-6 items-center gap-4">
                        <Label htmlFor="email" className="col-span-1 sm:col-span-2">
                            {tf("label2")}
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-1 sm:col-span-4"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-6 items-center gap-4">
                        <Label htmlFor="number" className="col-span-1 sm:col-span-2">
                            {tf("telNo")}
                        </Label>
                        <Input
                            id="number"
                            type="tel"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={number}
                            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                            className="col-span-1 sm:col-span-4"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-6 items-center gap-4">
                        <Label htmlFor="message" className="col-span-1 sm:col-span-2">
                            {tf("comment")}
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="col-span-1 sm:col-span-4"
                            placeholder={tf("typeMsg")}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>
                        {tg("getQuote")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
