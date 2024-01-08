'use client'
import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import "react-responsive-carousel/lib/styles/carousel.min.css"; 


const heroIamges = [
    {imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
    {imgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
    {imgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
    {imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
    {imgUrl: '/assets/images/hero-5.svg', alt: 'chair'}
]

const HeroCarousel = () => {
  return (
    <div className='hero-carousel'>
             <Carousel
                showThumbs={false}
                // autoPlay
                infiniteLoop
                // interval={2000}
                showArrows={false}
                showStatus={false}
        >
            {heroIamges.map((images) => (
                <Image 
                src={images.imgUrl}
                alt={images.alt}
                width={484}
                height={484}
                className='object-contain'
                key={images.alt}
                />
            ))}
        </Carousel>
    </div>
  )
}

export default HeroCarousel


