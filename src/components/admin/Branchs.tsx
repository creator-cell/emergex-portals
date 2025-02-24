import { branchData } from '@/enums/admin/branch'
import React from 'react'
import BranchRow from './BranchRow'

const Branchs = () => {
    return (
        <div className='w-full space-y-4'>
            {
                branchData?.map(branch => (
                    <BranchRow key={branch?.branchId} data={branch} />
                ))
            }
        </div>
    )
}

export default Branchs
