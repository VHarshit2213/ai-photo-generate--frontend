import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generatorAPI } from '../api/generator';
import { Loader2, Download, Trash2, Copy } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const GalleryPage = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await generatorAPI.getGeneratedPhotos();
        console.log('response', response)
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

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard!');
  };

  const handleDelete = (photoId) => {
    setPhotos(photos.filter(p => p._id !== photoId));
    toast.success('Image deleted!');
  };

//   const filteredPhotos = photos.filter(p =>
//     p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.prompt.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
        <p className="text-gray-600 mb-8">Your previously generated posters</p>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title or prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Gallery Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No images found</p>
            <a href="/generate" className="text-purple-600 hover:text-purple-700 font-medium">
              Create your first poster →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <img
                  src={photo.generatedImages[0]}
                  alt={photo.environment}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{photo.prompt}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(photo.generatedImages[0])}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded transition text-sm"
                    >
                      <Download size={16} /> Download
                    </button>
                    {/* <button
                      onClick={() => handleCopyPrompt(photo.prompt)}
                      className="flex-1 flex items-center justify-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded transition text-sm"
                    >
                      <Copy size={16} /> Copy
                    </button> */}
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded transition text-sm"
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
