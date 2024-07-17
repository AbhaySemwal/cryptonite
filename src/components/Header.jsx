"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Search, WbSunny } from '@mui/icons-material'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchCoins()
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const searchCoins = async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`)
      setSearchResults(response.data.coins.slice(0, 5))
      setShowDropdown(true)
    } catch (error) {
      console.error('Error searching coins:', error)
    }
  }

  const handleCoinSelect = (id) => {
    router.push(`/coin/${id}`)
    setSearchTerm('')
    setShowDropdown(false)
  }

  return (
    <nav className='p-2 md:py-3 md:px-5 flex items-center justify-between'>
      <Link href="/"><Image className='h-8 w-8 md:h-10 md:w-10' height={1000} width={1000} src={"/crypt.png"} alt="Logo" /></Link>
      <div className='relative flex items-center w-[15rem] md:w-[30.5rem] gap-1 pl-1.5 border-[1px] border-gray-600 rounded-md'>
        <span className='text-gray-400'><Search/></span>
        <input 
          className='outline-none p-1.5 bg-transparent w-full text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {showDropdown && (
          <div className="absolute text-xs top-full left-0 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
            {searchResults.map((coin) => (
              <div 
                key={coin.id}
                className="p-2 hover:bg-gray-800 cursor-pointer font-semibold flex items-center"
                onClick={() => handleCoinSelect(coin.id)}
              >
                <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-2" />
                <span>{coin.name} ({coin.symbol})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='cursor-pointer'>
        <WbSunny/>
      </div>
    </nav>
  )
}

export default Header