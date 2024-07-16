import Image from 'next/image'
import React from 'react'
import { Search, WbSunny } from '@mui/icons-material'
import Link from 'next/link'

const Header = () => {
  return (
    <nav className='text-white p-2 md:p-3 flex items-center justify-between'>
        <Link href="/"><Image className='h-8 w-8 md:h-10 md:w-10' height={1000} width={1000} src={"/crypt.png"}></Image></Link>
        <div className='flex items-center w-[15rem] md:w-[30rem] gap-1 pl-1.5 border-[1px] border-white rounded-md'>
            <Search/>
            <input className='outline-none p-1.5 bg-transparent w-full text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm' placeholder='Search...'></input>
        </div>
        <div className='cursor-pointer'>
            <WbSunny/>
        </div>
    </nav>
  )
}

export default Header