import React, { useState } from 'react';
import { FaDownload, FaSearch,FaTimes } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import{bannerAssets} from '../../assets/dummydata';
import { set } from 'mongoose';
const Banner = () => {
    const [searchQuery, setSearchQuery]=useState('');
   const{bannerImage,orbitImages ,video} = bannerAssets
const [showvideo, setShowVideo] = useState(false);
   
    const handleSearch = (e) => {
        e.preventDefault()
        console.log("searchQuery", searchQuery);

    }
    return (
        <div className="relative">
          <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10 z-0" />
    
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
              {/* Left Content */}
              <div className="flex-1 space-y-8 relative md:pr-8 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
                  We're Here<br />
                  <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                    For Food and Delivery
                  </span>
                </h1>
    
                <p className="text-lg lg:text-xl font-playfair italic text-amber-100 max-w-xl opacity-90 mx-auto md:mx-0">
                  Best cooks and best delivery service in town. Hot and Tasty food delivered to your doorsteps.
                </p>
    
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto md:mx-0 group">
                  <div className="relative flex items-center bg-amber-900/30 rounded-xl border border-amber-500/30 shadow-2xl transition-all w-full">
                    <div className="pl-6 pr-3 py-4">
                      <FaSearch className="text-xl text-amber-400/80" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for food, restaurants, or cuisines"
                      className="py-4 pr-6 w-full bg-transparent outline-none placeholder-amber-200/70 text-xl font-medium tracking-wide text-white"
                    />
                    <button
                      type="submit"
                      className="mr-4 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 font-semibold text-amber-900 hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow-lg hover:shadow-amber-300/20"
                    >
                      Search
                    </button>
                  </div>
                </form>
    
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
                  <button className="group flex items-center gap-3 bg-amber-800/30 hover:bg-amber-800/50 py-3 px-6 transition-all duration-300 border-2 border-amber-700/50 hover:border-amber-400 rounded-xl">
                    <FaDownload className="text-xl text-amber-400" />
                    <span className="text-lg">Download App</span>
                  </button>
    
                  <button
                    onClick={() => setShowVideo(true)}
                    className="group flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-300/30"
                  >
                    <FaPlay className="text-xl text-amber-900" />
                    <span className="text-lg text-amber-900 font-semibold">Watch Video</span>
                  </button>
                </div>
              </div>
    
              {/* Right Image */}
              <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px]">
                <div className="relative rounded-full p-1 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-700 shadow-2xl z-20 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] mx-auto">
                  <img
                    src={bannerImage}
                    alt="banner"
                    className="rounded-full border-4 sm:border-8 border-amber-900/50 w-full h-full object-cover object-top"
                  />
                  <div className='absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40 mix-blend-med '></div>
                </div>
                {/* ORBITAL IMAGES */}
{orbitImages.map((imgSrc, index) => (
  <div 
    key={index} 
    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
      ${index === 0 ? 'orbit' : `orbit-delay-${index * 5}`}
  
   
      className='w-[80px] xs:w-[100px] sm:w-[150px] h-[80px] xs:h-[100px] sm:h-[150px]`}>
    
      <img 
        src={imgSrc} 
        alt={`Orbiting ${index + 1}`} 
        className='w-full h-full rounded-full border border-amber-500/30 shadow-lg bg-amber-900 object-cover' 
      />
    </div>
  
))}
              </div>
            </div>
          </div>
            {/* Video Modal */}
            {showvideo && (
                <div className="fixed inset-0 bg-black-90 backdrop-blur-lg p-4 flex items-center justify-center z-50">
                        <button onClick={()=>{
                            setShowVideo(false)
                        }} className='absolute top-6 right-6 text-amber-400 hover:text-amber-300 text-xl z-10 transition-all
                        '>
                            <FaTimes/> 

                        </button>

                        <div   className="w-full max-w-4xl mx-auto "> 
                            <video 
                                src={video} 
                                controls 
                                autoPlay
                                className='w-fullaspect-video rounded-lg object-contain shadow-2xl'
                            >
                                <source src={video} type='video/mp4' />

                                </video>
                    </div>
                    </div>
                

            )}
        </div>
      );
  };
  

export default Banner
