'use client'

import React, { useState } from 'react'
import { scrapeAndStoreProduct } from '@/lib/actions';

const Searchbar = () => {
const [searchPrompt, setSearchPrompt] = useState('');
const [loading, setLoading] = useState(false)

const isValidAmazonProductURL = (url) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;


        //check if hostname contains amazon.com or amazon

        if(hostname.includes('amazon.com') ||
        hostname.includes('amazon') ||
        hostname.endsWith('amazon')
        ) {
            return true
        }
    } catch (error) {
        return false
    }
    return false
}


const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt)
    if(!isValidLink) return alert("Please provide a valid Amazon link")


    try {
        setLoading(true)

        //Scrape the product

        const product = await scrapeAndStoreProduct(searchPrompt)

    } catch (error) {
        console.log(error)
        
    } finally {
        setLoading(false)
    }
}

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
        <input
         className='searchbar-input'
         type='text'
         placeholder='Enter product link'
         value={searchPrompt}
         onChange={(e) => setSearchPrompt(e.target.value)}
        />

        <button 
        disabled={searchPrompt === ''} 
        className='searchbar-btn' 
        type='submit'
        >
            {loading ? "Searching..." : "Search"}
            
        </button>
    </form>
  )
}

export default Searchbar