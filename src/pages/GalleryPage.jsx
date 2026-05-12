import { useState, useEffect } from 'react';
import { generatorAPI } from '../api/generator';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await generatorAPI.getGeneratedPhotos();
        setPhotos(response.data || []);
      } catch (err) {
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleDownload = async (photo) => {
    try {
      await generatorAPI.downloadPhoto(photo.imageUrl, `${photo.title}.png`);
      toast.success('Image downloaded!');
    } catch (err) {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = (photoId) => {
    setPhotos(photos.filter((photo) => photo._id !== photoId));
    toast.success('Image deleted!');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-olive" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 surface-card p-6">
          <h1 className="mb-2 text-4xl font-bold text-neutral-900">Gallery</h1>
          <p className="text-neutral-700">Your previously generated posters</p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title or prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field-control"
          />
        </div>

        {photos.length === 0 ? (
          <div className="surface-card py-16 text-center">
            <p className="mb-4 text-neutral-700">No images found</p>
            <a href="/generate" className="font-medium text-accent-olive hover:text-neutral-900">
              Create your first poster →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo._id} className="overflow-hidden rounded-lg border border-primary-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
                <img src={photo.generatedImages[0]} alt={photo.environment} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-neutral-900">{photo.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-neutral-700">{photo.prompt}</p>
                  <p className="mb-4 text-xs text-neutral-600">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(photo.generatedImages[0])}
                      className="btn-secondary flex-1 py-2 text-sm"
                    >
                      <Download size={16} /> Download
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 transition hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default GalleryPage;
