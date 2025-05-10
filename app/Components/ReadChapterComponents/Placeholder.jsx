import React from 'react'
import { Image} from "lucide-react";
const Placeholder = () => {
    return (
        <div role='status' className='w-[380px] h-[75vh] '>
            <div className="animate-pulse bg-gray-800 w-[380px] h-[75vh] rounded-lg mb-5 flex justify-center items-center">
                <Image className="w-8 h-8 stroke-gray-400"/>
            </div>
        </div>
    )
}

export default Placeholder