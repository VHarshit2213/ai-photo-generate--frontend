import { useEffect, useMemo, useState } from 'react';
import { generatorAPI } from '../api/generator';
import { ChevronLeft, ChevronRight, Download, Eye, Loader2, Search, Sparkles, Trash2, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const getPhotoImages = (photo) => {
  if (Array.isArray(photo?.generatedImages)) return photo.generatedImages;
  if (Array.isArray(photo?.images)) return photo.images;
  if (photo?.imageUrl) return [photo.imageUrl];
  if (photo?.url) return [photo.url];
  return [];
};

const getImageUrl = (image) => image?.imageUrl || image?.url || image;

export const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await generatorAPI.getGeneratedPhotos();
        setPhotos(response.data || response.photos || []);
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

    return photos
      .flatMap((photo) =>
        getPhotoImages(photo).map((image, imageIndex) => ({
          photo,
          image,
          imageIndex,
          url: getImageUrl(image),
          id: `${photo?._id || photo?.id || 'photo'}-${imageIndex}`,
        })),
      )
      .filter((item) => item.url)
      .filter((item) => {
        if (!term) return true;
        const title = item.photo?.title || '';
        const prompt = item.photo?.prompt || '';
        const environment = item.photo?.environment || '';
        return `${title} ${prompt} ${environment}`.toLowerCase().includes(term);
      });
  }, [photos, searchTerm]);

  const activeItem = previewIndex === null ? null : galleryItems[previewIndex];

  useEffect(() => {
    if (!activeItem) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewIndex(null);
      if (event.key === 'ArrowRight') setPreviewIndex((current) => (current + 1) % galleryItems.length);
      if (event.key === 'ArrowLeft') setPreviewIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length);
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
      const title = item.photo?.title || 'generated-image';
      await generatorAPI.downloadPhoto(item.url, `${title}-${item.imageIndex + 1}.png`);
      toast.success('Image downloaded');
    } catch (err) {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = (photoId) => {
    setPhotos((currentPhotos) => currentPhotos.filter((photo) => (photo._id || photo.id) !== photoId));
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
        </div>

        {galleryItems.length === 0 ? (
          <div className="surface-card px-6 py-16 text-center">
            <p className="mb-4 text-lg font-semibold text-neutral-900">No images found</p>
            <a href="/generate" className="font-medium text-primary-600 hover:text-primary-500">
              Create your first image
            </a>
          </div>
        ) : (
          <div className="columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
            {galleryItems.map((item, index) => (
              <article
                key={item._id}
                className="group break-inside-avoid overflow-hidden rounded-lg border border-primary-100 bg-white shadow-[0_18px_45px_rgba(20,15,28,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <button type="button" className="relative block w-full text-left" onClick={() => setPreviewIndex(index)}>
                  <img src={item.url} alt={`Generated image ${index + 1}`} className="w-full h-full min-h-72 object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-neutral-900/0 opacity-0 transition group-hover:bg-neutral-900/35 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-primary-700 shadow-lg">
                      <Eye size={18} /> Preview
                    </span>
                  </span>
                </button>

                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">Generated image</h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {item.photo?.createdAt ? new Date(item.photo.createdAt).toLocaleDateString() : 'Saved image'}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold capitalize text-primary-700">
                      {item.photo?.environment || 'AI'}
                    </span>
                  </div>


                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleDownload(item)} className="btn-secondary flex-1 py-2 text-sm">
                      <Download size={16} /> Download
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.photo?._id)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                      aria-label="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
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
            <img src={activeItem.url} alt={activeItem.photo?.title || 'Generated preview'} className="max-h-[78vh] min-h-[78vh] w-full object-contain bg-neutral-950" />
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-neutral-900">{activeItem.photo?.title || 'Generated image'}</h2>
                <p className="text-sm text-neutral-600">
                  {previewIndex + 1} of {galleryItems.length}
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
