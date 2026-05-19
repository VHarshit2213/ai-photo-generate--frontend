import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { categoryAPI } from '../api/category';
import { generatorAPI } from '../api/generator';
import {
  Camera,
  CheckCircle2,
  Download,
  ImagePlus,
  Layers,
  Loader2,
  Sparkles,
  UploadCloud,
  Wand2,
  X,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const getCategoryId = (category) => category?._id || category?.id;

const environmentOptions = [
  { value: 'outdoor', label: 'Outdoor', hint: 'Natural light' },
  { value: 'indoor', label: 'Indoor', hint: 'Room setting' },
  // { value: 'lifestyle', label: 'Lifestyle', hint: 'Editorial mood' },
];

const panelClass = 'surface-card';
const elevatedPanelClass = 'rounded-lg border border-primary-100 bg-primary-50/60';
const accentPillClass = 'rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700';

const getGeneratedImages = (response) => {
  const candidates = [
    response?.data?.generatedImages,
    response?.data?.generatedPhotos,
    response?.generatedImages,
    response?.generatedPhotos,
    response?.photos,
  ];

  return candidates.find((item) => Array.isArray(item)) || [];
};

export const GeneratorPage = () => {
  const {
    register,
    handleSubmit,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: '',
      environment: 'outdoor',
      poseCount: 1,
    },
  });

  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const previewsRef = useRef({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const selectedCategoryId = watch('categoryId');
  const selectedEnvironment = watch('environment');
  const poseCount = watch('poseCount');

  const selectedCategory = useMemo(
    () => categories.find((category) => getCategoryId(category) === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  const selectedCategoryOptions = Array.isArray(selectedCategory?.options) ? selectedCategory.options : [];
  const requiredUploads = selectedCategoryOptions.length;
  const uploadedCount = Object.values(selectedFiles).filter(Boolean).length;
  const uploadProgress = requiredUploads ? Math.round((uploadedCount / requiredUploads) * 100) : 0;
  const canGenerate = Boolean(selectedCategoryId) && !generating;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryAPI.getCategories();
        setCategories(response.data || response.categories || []);
      } catch (err) {
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedFiles({});
    setPreviews((currentPreviews) => {
      Object.values(currentPreviews).forEach((url) => URL.revokeObjectURL(url));
      previewsRef.current = {};
      return {};
    });
    resetField('environment', { defaultValue: 'outdoor' });
    resetField('poseCount', { defaultValue: selectedCategory?.minImages || 1 });
  }, [resetField, selectedCategory]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (option, file) => {
    if (!file) return;

    setSelectedFiles((currentFiles) => ({
      ...currentFiles,
      [option]: file,
    }));

    setPreviews((currentPreviews) => {
      if (currentPreviews[option]) {
        URL.revokeObjectURL(currentPreviews[option]);
      }

      const nextPreviews = {
        ...currentPreviews,
        [option]: URL.createObjectURL(file),
      };
      previewsRef.current = nextPreviews;
      return nextPreviews;
    });
  };

  const removeFile = (option) => {
    setSelectedFiles((currentFiles) => {
      const nextFiles = { ...currentFiles };
      delete nextFiles[option];
      return nextFiles;
    });

    setPreviews((currentPreviews) => {
      if (currentPreviews[option]) {
        URL.revokeObjectURL(currentPreviews[option]);
      }

      const nextPreviews = { ...currentPreviews };
      delete nextPreviews[option];
      previewsRef.current = nextPreviews;
      return nextPreviews;
    });
  };

  const onSubmit = async (data) => {
    if (!selectedCategory) {
      toast.error('Select a category first');
      return;
    }

    try {
      setGenerating(true);
      setGeneratedImages([]);

      const response = await generatorAPI.generatePhotos({
        categoryId: data.categoryId,
        environment: data.environment,
        poseCount: data.poseCount,
        options: selectedCategoryOptions.map((option) => ({
          option,
          file: selectedFiles[option],
        })),
      });

      const images = getGeneratedImages(response);
      setGeneratedImages(images);

      if (images.length > 0) {
        toast.success('Images generated successfully');
      } else {
        toast.success('Generation request submitted');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate images');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (image, index = 0) => {
    const imageUrl = image?.imageUrl || image?.url || image;

    if (!imageUrl) return;

    try {
      await generatorAPI.downloadPhoto(imageUrl, `generated-look-${Date.now()}-${index + 1}.png`);
      toast.success('Image downloaded');
    } catch (err) {
      toast.error('Failed to download image');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 text-left text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className={`mb-8 p-5 md:p-6 soft-rise ${panelClass}`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary-700">
                <Sparkles size={15} /> Fashion_Studio
              </p>
              <h1 className="mb-3 text-3xl font-bold text-neutral-900 md:text-4xl">Generate fashion images</h1>
              <p className="max-w-2xl text-neutral-600">
                Pick a category, upload clean references for each garment part, then generate production-ready poses.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-primary-100 bg-primary-50/60 p-2 shadow-sm">
              <div className="rounded-md bg-white px-3 py-2">
                <p className="text-xs font-medium text-neutral-500">Category</p>
                <p className="truncate text-sm font-semibold text-neutral-900 capitalize">{selectedCategory?.name || 'Not set'}</p>
              </div>
              <div className="rounded-md bg-white px-3 py-2">
                <p className="text-xs font-medium text-neutral-500">Uploads</p>
                <p className="text-sm font-semibold text-neutral-900">{uploadedCount}/{requiredUploads || 0}</p>
              </div>
              <div className="rounded-md bg-white px-3 py-2">
                <p className="text-xs font-medium text-neutral-500">Poses</p>
                <p className="text-sm font-semibold text-neutral-900">{poseCount || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section className={`soft-rise p-5 md:p-6 ${panelClass}`}>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-primary-700">
                      <Layers size={17} />
                    </span>
                    <h2 className="text-xl font-semibold text-neutral-900">Setup</h2>
                  </div>
                  <p className="text-sm text-neutral-600">These details are sent with the image references.</p>
                </div>
                {selectedCategory && (
                  <span className={`shrink-0 ${accentPillClass}`}>
                    {selectedCategory.minImages}-{selectedCategory.maxImages} poses
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="field-control"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option className="capitalize" key={getCategoryId(category)} value={getCategoryId(category)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                  {selectedCategoryOptions.length > 0 && (
                    <div className={`mt-3 p-3 ${elevatedPanelClass}`}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                        Image inputs required for {selectedCategory.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategoryOptions.map((option) => (
                          <span
                            key={option}
                            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium capitalize text-neutral-800 shadow-sm"
                          >
                            {selectedFiles[option] ? (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : (
                              <ImagePlus size={14} className="text-primary-500" />
                            )}
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Environment</label>
                  <div className="grid grid-cols-2 gap-2">
                    {environmentOptions.map((environment) => (
                      <label
                        key={environment.value}
                        className={`cursor-pointer rounded-lg border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${selectedEnvironment === environment.value
                          ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-sm'
                          : 'border-primary-100 bg-white text-neutral-700'
                          }`}
                      >
                        <input
                          type="radio"
                          value={environment.value}
                          {...register('environment', { required: 'Environment is required' })}
                          className="sr-only"
                        />
                        <span className="block text-sm font-semibold">{environment.label}</span>
                        <span className="mt-1 block text-xs opacity-70">{environment.hint}</span>
                      </label>
                    ))}
                  </div>
                  {errors.environment && <p className="text-red-500 text-sm mt-1">{errors.environment.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Pose count</label>
                  <input
                    type="number"
                    min={selectedCategory?.minImages || 1}
                    max={selectedCategory?.maxImages || 4}
                    {...register('poseCount', {
                      required: 'Pose count is required',
                      valueAsNumber: true,
                      min: {
                        value: selectedCategory?.minImages || 1,
                        message: `Minimum ${selectedCategory?.minImages || 1}`,
                      },
                      max: {
                        value: selectedCategory?.maxImages || 4,
                        message: `Maximum ${selectedCategory?.maxImages || 4}`,
                      },
                    })}
                    className="field-control"
                  />
                  {errors.poseCount && <p className="text-red-500 text-sm mt-1">{errors.poseCount.message}</p>}
                </div>
              </div>
            </section>

            <section className={`soft-rise p-5 md:p-6 ${panelClass}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-primary-700">
                      <Camera size={17} />
                    </span>
                    <h2 className="text-xl font-semibold text-neutral-900">Reference uploads</h2>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {selectedCategory
                      ? `Upload one image for each ${selectedCategory.name} option.`
                      : 'Select a category to see the required upload fields.'}
                  </p>
                </div>
                {selectedCategory && (
                  <div className="min-w-40">
                    <div className="mb-1 flex items-center justify-between text-sm font-medium text-neutral-700">
                      <span>{uploadedCount}/{requiredUploads} ready</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {!selectedCategory ? (
                <div className="rounded-lg border border-dashed border-primary-200 bg-primary-50/60 px-6 py-12 text-center">
                  <ImagePlus className="mx-auto mb-3 h-9 w-9 text-primary-500" />
                  <p className="text-sm font-medium text-neutral-600">Category options will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategoryOptions.map((option, index) => (
                    <div
                      key={option}
                      className="group rounded-lg border border-primary-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-card-hover"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold capitalize text-neutral-900">Upload {option} image</p>
                          <p className="text-xs text-neutral-500">options[{index}][file]</p>
                        </div>
                        {selectedFiles[option] && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 transition group-hover:scale-110" />
                        )}
                      </div>

                      {previews[option] ? (
                        <div className="relative overflow-hidden rounded-lg border border-primary-100 bg-white">
                          <img
                            src={previews[option]}
                            alt={`${option} preview`}
                            className="h-52 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(option)}
                            disabled={generating}
                            className="absolute right-2 top-2 rounded-full disabled:cursor-not-allowed bg-white/95 p-2 text-neutral-700 shadow hover:bg-primary-50"
                            aria-label={`Remove ${option} image`}
                          >
                            <X size={16} />
                          </button>
                          <div className="flex items-center justify-between gap-3 border-t border-primary-100 px-3 py-2">
                            <p className="min-w-0 truncate text-xs text-neutral-600">{selectedFiles[option]?.name}</p>
                            {!generating && <label className="shrink-0 cursor-pointer rounded-md bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-500">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => handleFileChange(option, event.target.files?.[0])}
                              />
                            </label>}
                          </div>
                        </div>
                      ) : (
                        <label
                          className={`flex h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary-200 bg-gradient-to-b from-white to-primary-50 px-4 text-center transition
                          ${generating
                              ? "pointer-events-none opacity-50"
                              : "hover:border-primary-400"
                            }`}
                        >
                          <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary-100 text-primary-700 transition group-hover:scale-110">
                            <UploadCloud className="h-6 w-6" />
                          </span>

                          <span className="text-sm font-medium text-neutral-800">
                            Upload {option}
                          </span>

                          <span className="mt-1 text-xs text-neutral-500">
                            JPG, PNG, or WEBP
                          </span>

                          <input
                            disabled={generating}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) =>
                              handleFileChange(option, event.target.files?.[0])
                            }
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={!canGenerate}
              className="btn-primary soft-rise w-full"
            >
              {generating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
              {generating ? 'Generating images...' : 'Generate images'}
            </button>
          </form>

          <section className={`soft-rise p-5 md:p-6 ${panelClass}`}>

            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-primary-700">
                  <Sparkles size={17} />
                </span>
                <h2 className="text-xl font-semibold text-neutral-900">Output</h2>
              </div>
              <p className="text-sm text-neutral-600">Generated images will appear here after the API responds.</p>
            </div>

            {generating ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-primary-100 bg-gradient-to-b from-white to-primary-50 text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-lg shadow-primary-100">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
                <p className="font-medium text-neutral-900">Creating your looks</p>
                <p className="mt-1 text-sm text-neutral-600">This can take a moment.</p>
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 ">
                {generatedImages.map((image, index) => {
                  const imageUrl = image?.imageUrl || image?.url || image;

                  return (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="overflow-hidden rounded-lg border border-primary-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <img src={imageUrl} alt={`Generated look ${index + 1}`} className="w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDownload(image, index)}
                        className="flex w-full items-center justify-center gap-2 bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-500"
                      >
                        <Download size={16} /> Download
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-primary-200 bg-primary-50/60 px-6 text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-primary-600 shadow-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
                <p className="font-medium text-neutral-900">No image generated yet</p>
                <p className="mt-1 text-sm text-neutral-600">Complete the required uploads and generate your first set.</p>
              </div>
            )}
          </section>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default GeneratorPage;
