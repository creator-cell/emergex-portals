import React from 'react'
import { Label } from '../ui/label'

interface Props {

}

const AssessmentCard = () => {
    return (
        <div className='bg-[#f1f6f0] w-full p-8 rounded-[40px] space-y-5'>
            <Label className='text-[#1E1E1E] text-[20px] leading-6'>Damage assessment </Label>
            <div className='grid grid-cols-2 gap-3'>
                <div className='flex  flex-col items-center justify-center'>
                    <Label className='text-[#1E1E1E] text-[48px] leading-[58px] font-light'>3</Label>
                    <Label className='text-[#757575] text-[14px] font-medium leading-5'>Miner damage</Label>
                </div>
                <div className='flex flex-col  items-center justify-center ' >
                    <Label className='text-[#1E1E1E] text-[48px] leading-[58px] font-light'>2</Label>
                    <Label className='text-[#757575] text-[14px] font-medium leading-5'>Severe damage</Label>
                </div>
            </div>
        </div>
    )
}

export default AssessmentCard
