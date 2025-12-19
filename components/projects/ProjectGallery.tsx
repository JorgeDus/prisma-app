
'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface ProjectGalleryProps {
    coverImage: string | null
    galleryImages: string[]
}

export default function ProjectGallery({ coverImage, galleryImages }: ProjectGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const allImages = [coverImage, ...galleryImages].filter(Boolean) as string[]

    if (allImages.length === 0) return null

    return (
        <div className="space-y-4">
            {/* Main Featured Image / Display */}
            <div
                className="relative aspect-[21/9] bg-gray-100 rounded-[2rem] overflow-hidden cursor-zoom-in group shadow-sm border border-gray-100"
                onClick={() => setSelectedImage(coverImage || galleryImages[0])}
            >
                {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Maximize2 size={48} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" size={32} />
                </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {allImages.map((url, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedImage(url)}
                            className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${selectedImage === url ? 'border-purple-500 ring-2 ring-purple-100' : 'border-transparent hover:border-purple-200'}`}
                        >
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Full view"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        />

                        {/* Navigation (Optional but nice) */}
                        {allImages.length > 1 && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:-mx-16">
                                <button
                                    onClick={() => {
                                        const idx = allImages.indexOf(selectedImage)
                                        setSelectedImage(allImages[(idx - 1 + allImages.length) % allImages.length])
                                    }}
                                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => {
                                        const idx = allImages.indexOf(selectedImage)
                                        setSelectedImage(allImages[(idx + 1) % allImages.length])
                                    }}
                                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
