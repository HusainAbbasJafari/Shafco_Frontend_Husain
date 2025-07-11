"use client"

import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export function DatePicker({ setDatePickerValue, datePickerValue }) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(new Date("2025-06-01"))
    const [month, setMonth] = useState(date)
    const [value, setValue] = useState(formatDate(date))

    useEffect(() => {
        setDatePickerValue(value)
    }, [value])

    return (
        <div className="relative flex gap-2">
            <Input
                id="date"
                value={datePickerValue || ''}
                placeholder="June 01, 2025"
                className="bg-background pr-10"
                onChange={(e) => {
                    const newDate = new Date(e.target.value)
                    setValue(e.target.value)
                    if (isValidDate(newDate)) {
                        setDate(newDate)
                        setMonth(newDate)
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(selectedDate) => {
                            setDate(selectedDate)
                            setValue(formatDate(selectedDate))
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
