import { useEffect, useMemo, useState } from 'react';
import { generatorAPI } from '../api/generator';
import { ChevronLeft, ChevronRight, Download, Eye, Loader2, Search, Sparkles, Trash2, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getPhotoImages = (photo) => {
  if (Array.isArray(photo?.generatedImages)) return photo.generatedImages;
  if (Array.isArray(photo?.images)) return photo.images;
  if (photo?.imageUrl) return [photo.imageUrl];
  if (photo?.url) return [photo.url];
  return [];
};

const getImageUrl = (image) => image?.imageUrl || image?.url || image;

const isGeneratedWithin24Hours = (photo) => {
  if (!photo?.createdAt) return true;
  const createdTime = new Date(photo.createdAt).getTime();
  if (Number.isNaN(createdTime)) return true;
  return Date.now() - createdTime <= DAY_IN_MS;
};

const getFilename = (item) => {
  const datePart = item?.createdAt
    ? new Date(item.createdAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  return `generated-image-${datePart}-${item.activeImageIndex + 1}.png`;
};

export const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewIndex, setPreviewIndex] = useState(null);
  const [activeSlides, setActiveSlides] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await generatorAPI.getGeneratedPhotos();
        const freshPhotos = (response.data || []).filter(isGeneratedWithin24Hours);
        setPhotos(freshPhotos);
      } catch (err) {
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const galleryItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return photos.filter((item) => {
      if (!term) return true;

      const environment = item.environment || item.photo?.environment || '';

      return `${environment}`
        .toLowerCase()
        .includes(term);
    }).map((item) => {
      const images = getPhotoImages(item).map(getImageUrl).filter(Boolean);
      const activeImageIndex = Math.min(activeSlides[item._id] || 0, Math.max(images.length - 1, 0));

      return {
        ...item,
        images,
        activeImageIndex,
        activeImageUrl: images[activeImageIndex],
      };
    }).filter((item) => item.activeImageUrl);
  }, [photos, searchTerm, activeSlides]);

  const updateSlide = (itemId, nextIndex) => {
    setActiveSlides((current) => ({
      ...current,
      [itemId]: nextIndex,
    }));
  };

  const moveSlide = (event, item, direction) => {
    event.stopPropagation();
    if (item.images.length < 2) return;

    const nextIndex = (item.activeImageIndex + direction + item.images.length) % item.images.length;
    updateSlide(item._id, nextIndex);
  };

  const selectSlide = (event, itemId, imageIndex) => {
    event.stopPropagation();
    updateSlide(itemId, imageIndex);
  };

  const openPreview = (index) => {
    setPreviewIndex(index);
  };

  const activeItem = previewIndex === null ? null : galleryItems[previewIndex];

  const setPreviewSlide = (imageIndex) => {
    if (!activeItem) return;
    updateSlide(activeItem._id, imageIndex);
  };

  const movePreviewSlide = (direction) => {
    if (!activeItem || activeItem.images.length < 2) return;

    const nextIndex = (activeItem.activeImageIndex + direction + activeItem.images.length) % activeItem.images.length;
    setPreviewSlide(nextIndex);
  };

  useEffect(() => {
    if (previewIndex !== null && previewIndex >= galleryItems.length) {
      setPreviewIndex(galleryItems.length ? galleryItems.length - 1 : null);
    }
  }, [galleryItems.length, previewIndex]);

  useEffect(() => {
    setActiveSlides((current) => {
      const validIds = new Set(photos.map((photo) => photo._id));
      return Object.fromEntries(Object.entries(current).filter(([id]) => validIds.has(id)));
    });
  }, [photos]);

  useEffect(() => {
    if (!activeItem) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewIndex(null);
      if (event.key === 'ArrowRight') setPreviewIndex((current) => (current + 1) % galleryItems.length);
      if (event.key === 'ArrowLeft') setPreviewIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length);
      if (event.key === 'ArrowUp') movePreviewSlide(-1);
      if (event.key === 'ArrowDown') movePreviewSlide(1);
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeItem, galleryItems.length]);

  const handleDownload = async (item) => {
    try {
      await generatorAPI.downloadPhoto(item.activeImageUrl, getFilename(item));
      toast.success('Image downloaded');
    } catch (err) {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = (photoId) => {
    setPhotos((currentPhotos) => currentPhotos.filter((photo) => (photo._id) !== photoId));
    setPreviewIndex(null);
    toast.success('Image removed from gallery');
  };

  const showPrevious = () => setPreviewIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length);
  const showNext = () => setPreviewIndex((current) => (current + 1) % galleryItems.length);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-lg border border-white/20 bg-white p-6 text-black shadow-card backdrop-blur-xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary-700">
            <Sparkles size={15} /> Gallery
          </p>
          <h1 className="mb-2 text-4xl font-bold">Past generated images</h1>
          <p className="max-w-2xl text-neutral-600">Browse, preview, and download the images you have already created.</p>
          <label className="mt-5 flex max-w-md items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-700 focus-within:border-primary-300 focus-within:bg-white">
            <Search size={18} className="shrink-0 text-neutral-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by environment"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </label>
        </div>

        {galleryItems.length === 0 ? (
          <div className="surface-card px-6 py-16 text-center">
            <p className="mb-4 text-lg font-semibold text-neutral-900">No images found</p>
            <a href="/generate" className="font-medium text-primary-600 hover:text-primary-500">
              Create your first image
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item, index) => (
              <article
                key={item?._id}
                className="group break-inside-avoid overflow-hidden rounded-lg border border-primary-100 bg-white shadow-[0_18px_45px_rgba(20,15,28,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative">
                  <button type="button" className="block w-full text-left" onClick={() => openPreview(index)}>
                    <img src={item.activeImageUrl} alt={`Generated image ${index + 1}`} className="h-full min-h-72 w-full object-cover" />
                  </button>

                  {item.images.length > 1 && (
                    <>
                      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-neutral-950/55 px-2.5 py-2">
                        {item.images.map((imageUrl, imageIndex) => (
                          <button
                            type="button"
                            key={`${imageUrl}-${imageIndex}`}
                            onClick={(event) => selectSlide(event, item._id, imageIndex)}
                            aria-label={`Show generated image ${imageIndex + 1}`}
                            className={`h-2 w-2 rounded-full transition ${imageIndex === item.activeImageIndex ? 'bg-white' : 'bg-white/45 hover:bg-white/75'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <button type="button" onClick={() => openPreview(index)} className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/0 opacity-0 transition group-hover:bg-neutral-900/35 group-hover:opacity-100" aria-label="Preview generated image">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-primary-700 shadow-lg">
                      <Eye size={18} /> Preview
                    </span>
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">Generated image</h3>
                      <div className='flex gap-3'> <p className="mt-1 text-xs text-neutral-500">
                        {item?.createdAt ? new Date(item?.createdAt).toLocaleDateString() : 'Saved image'}
                      </p>
                        {item.images.length > 1 && (
                          <p className="mt-1 text-xs font-medium text-neutral-500">
                            {item.activeImageIndex + 1} of {item.images.length}
                          </p>
                        )}</div>
                    </div>
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold capitalize text-primary-700">
                      {item?.environment || 'AI'}
                    </span>
                  </div>


                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleDownload(item)} className="btn-secondary flex-1 py-2 text-sm">
                      <Download size={16} /> Download
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => handleDelete(item?._id)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                      aria-label="Delete image"
                    >
                      <Trash2 size={16} />
                    </button> */}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setPreviewIndex(null)}
            className="absolute right-5 top-5 rounded-full bg-white/95 p-3 text-neutral-900 shadow-lg transition hover:bg-primary-50"
            aria-label="Close preview"
          >
            <X size={22} />
          </button>

          {galleryItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 text-primary-700 shadow-lg transition hover:bg-primary-50 md:grid"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 text-primary-700 shadow-lg transition hover:bg-primary-50 md:grid"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg border border-white/20 bg-white shadow-2xl">
            <div className="relative bg-neutral-950">
              <img src={activeItem.activeImageUrl} alt={activeItem.photo?.title || 'Generated preview'} className="max-h-[78vh] min-h-[78vh] w-full object-contain" />
              {activeItem.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg">

                  <div className="flex gap-1.5">
                    {activeItem.images.map((imageUrl, imageIndex) => (
                      <button
                        type="button"
                        key={`${imageUrl}-${imageIndex}`}
                        onClick={() => setPreviewSlide(imageIndex)}
                        aria-label={`Show generated image ${imageIndex + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition ${imageIndex === activeItem.activeImageIndex ? 'bg-primary-700' : 'bg-neutral-300 hover:bg-primary-300'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-neutral-900">{activeItem.photo?.title || 'Generated image'}</h2>
                <p className="text-sm text-neutral-600">
                  Set {previewIndex + 1} of {galleryItems.length}
                  {activeItem.images.length > 1 ? `, image ${activeItem.activeImageIndex + 1} of ${activeItem.images.length}` : ''}
                </p>
              </div>
              <button type="button" onClick={() => handleDownload(activeItem)} className="btn-primary">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default GalleryPage;
