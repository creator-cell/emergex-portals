"use client"
import React from 'react'
import { Button } from '../ui/button'
import { MoveLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { arrow_right } from '@/assets/icons'

interface BackButtonProps {
    className?: string
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
    const router = useRouter()
    return (
        <Button variant={"ghost"} className={cn("rounded-full bg-white size-[50px] ", className)} onClick={() => router.back()}>
            {/* <MoveLeft strokeWidth={2} /> */}
            <Image
                src={arrow_right ?? ""}
                alt="arrow right"
                width={34}
                height={34}
            />
        </Button>
    )
}

export default BackButton
