"use client";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from "react";

interface AddNewFormProps {
    triggerLabel: React.ReactNode
    isTriggerLabelAsChild?: boolean
    dialogContent: React.ReactNode
}

const AddNewForm: React.FC<AddNewFormProps> = ({ triggerLabel, dialogContent, isTriggerLabelAsChild = true }) => {
    return (
        <Dialog  >
            <DialogTrigger asChild={isTriggerLabelAsChild}>
                {triggerLabel}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-white !rounded-2xl">
                {dialogContent}
            </DialogContent>
        </Dialog>
    )
}


export default AddNewForm;