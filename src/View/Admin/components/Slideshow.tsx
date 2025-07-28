import { useEffect, useState, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Background {
    imageId: number;
    mobileUrl: string;
    webUrl: string;
}

interface SlideshowProps {
    images: Background[];
}

export default function Slideshow({ images }: SlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const preloadImages = useCallback(() => {
        setLoading(true);
        setError(false);

        const loadPromises = images.map(img => {
            return new Promise<void>((resolve) => {
                const img1 = new Image();
                img1.src = img.mobileUrl;
                img1.onload = () => resolve();
                img1.onerror = () => resolve();

                const img2 = new Image();
                img2.src = img.webUrl;
                img2.onload = () => resolve();
                img2.onerror = () => resolve();
            });
        });

        Promise.all(loadPromises)
            .then(() => {
                setLoading(false);
                setLoaded(true);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [images]);

    useEffect(() => {
        preloadImages();
    }, [images, preloadImages]);

    useEffect(() => {
        if (!loaded || loading || error) return;

        const timer = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [loaded, loading, error, images.length]);

    const goToPrevious = () => {
        setLoaded(false);
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
        setTimeout(() => setLoaded(true), 10);
    };

    const goToNext = () => {
        setLoaded(false);
        setCurrentIndex(prev => (prev + 1) % images.length);
        setTimeout(() => setLoaded(true), 10);
    };

    const goToSlide = (index: number) => {
        setLoaded(false);
        setCurrentIndex(index);
        setTimeout(() => setLoaded(true), 10);
    };

    const currentImage = images[currentIndex];
    if (!currentImage || loading) {
        return (
            <div className="flex justify-center items-center w-full max-w-5xl mx-auto h-96 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Resimler yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-full max-w-5xl mx-auto h-96 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <div className="text-center p-6">
                    <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-700 mb-2">Resim Yükleme Hatası</h3>
                    <p className="text-red-600 mb-4">Üzgünüz, resimler yüklenirken bir sorun oluştu.</p>
                    <button
                        onClick={preloadImages}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    const shortenUrl = (url: string) => {
        if (!url) return "";
        try {
            const parsedUrl = new URL(url);
            // Daha kısa bir gösterim: domain + dosya adının ilk 10 karakteri
            const filename = parsedUrl.pathname.split('/').pop() || '';
            const shortenedFilename = filename.length > 12
                ? filename.substring(0, 8) + '...' + filename.slice(-4)
                : filename;
            return `${parsedUrl.hostname}/.../${shortenedFilename}`;
        } catch {
            return url.length > 30 ? url.substring(0, 15) + '...' + url.substring(url.length - 10) : url;
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 bg-gray-200">
                {/* Mobil Resim */}
                <div className="relative bg-white">
                    <div className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                        <img
                            src={currentImage.mobileUrl}
                            alt="Mobil"
                            className="w-full h-auto aspect-[3/2] object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'https://img.freepik.com/premium-vector/error-404-page-found-natural-concept-illustration-background-web-missing-landing-page_607751-171.jpg';
                                e.currentTarget.alt = 'Resim yüklenemedi';
                            }}
                        />
                    </div>
                    {/* Bilgi çubuğu - indikatörlerden daha yüksekte olacak */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white p-3 sm:p-4 z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs font-medium">Mobil Görünüm</span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <span className="opacity-80 mr-1">ID:</span>
                                        <span className="bg-gray-700 px-1.5 py-0.5 rounded">{currentImage.imageId}</span>
                                    </div>
                                </div>
                            </div>
                            <a
                                href={currentImage.mobileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-black/40 hover:bg-black/60 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center transition-colors max-w-[140px] sm:max-w-[160px] truncate"
                                title={currentImage.mobileUrl}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                                <span className="truncate">{shortenUrl(currentImage.mobileUrl)}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Web Resim */}
                <div className="relative bg-white">
                    <div className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                        <img
                            src={currentImage.webUrl}
                            alt="Web"
                            className="w-full h-auto aspect-[3/2] object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'https://img.freepik.com/premium-vector/error-404-page-found-natural-concept-illustration-background-web-missing-landing-page_607751-171.jpg';
                                e.currentTarget.alt = 'Resim yüklenemedi';
                            }}
                        />
                    </div>
                    {/* Bilgi çubuğu - indikatörlerden daha yüksekte olacak */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white p-3 sm:p-4 z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-medium">Web Görünüm</span>
                                </div>
                            </div>
                            <a
                                href={currentImage.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-black/40 hover:bg-black/60 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center transition-colors max-w-[140px] sm:max-w-[160px] truncate"
                                title={currentImage.webUrl}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                                <span className="truncate">{shortenUrl(currentImage.webUrl)}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105 z-20"
                aria-label="Önceki resim"
            >
                <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105 z-20"
                aria-label="Sonraki resim"
            >
                <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* İndikatörler - Bilgi çubuğunun üzerinde */}
            <div className="absolute bottom-14 sm:bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${idx === currentIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Slayt Sayacı */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/60 text-white text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full z-20">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}