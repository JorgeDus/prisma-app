
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
                className="relative aspect-[21/9] bg-slate-100 rounded-[2.5rem] overflow-hidden cursor-zoom-in group shadow-sm border border-slate-200"
                onClick={() => setSelectedImage(coverImage || galleryImages[0])}
            >
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Maximize2 size={48} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                        <Maximize2 className="text-white" size={24} />
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-4 px-2">
                    {allImages.map((url, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedImage(url)}
                            className={`relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${selectedImage === url ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-indigo-200'}`}
                        >
                            <img src={url} alt={`Gallery ${idx}`} className={`w-full h-full object-cover transition-all duration-500 ${selectedImage === url ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
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
