import React from 'react'
import { Spinner } from '@nextui-org/react'
export default function Loading() {
    return (
        <div className='h-screen flex justify-center items-center w-full'>

            <Spinner  color="default" label="Loading" size="lg" labelColor="foreground" />

        </div>
    )
}
