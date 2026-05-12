import { Check } from 'lucide-react';

export const RightContent = ({ title, desc }) => {
    const features = [
        'Fast image generation',
        // 'Creative control tools',
        'Saved project gallery',
    ];

    return (
        <>
            <div className="absolute top-14 right-12 h-28 w-28 rounded-full border-[18px] border-accent-yellow/40 animate-pulse" />

            <div className="absolute bottom-16 left-16 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />

            <div className="absolute top-1/3 left-25 h-24 w-24 rounded-full bg-accent-lime/90 blur-2xl" />

            <div className="relative z-10 max-w-lg text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 backdrop-blur-md shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-neutral-700">
                        AI Powered Platform
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-neutral-900">
                    {title}
                </h1>

                {/* Description */}
                <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-neutral-700">
                    {desc}
                </p>

                {/* Features */}
                <div className="grid gap-4">
                    {features.map((item) => (
                        <div
                            key={item}
                            className="group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/50 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/70 hover:shadow-lg"
                        >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-lime shadow-inner">
                                <Check className="h-5 w-5 text-neutral-900" aria-hidden="true" />
                            </div>

                            <h3 className="text-base font-semibold text-neutral-900">
                                {item}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Bottom Small Text */}
                <p className="mt-10 text-sm text-neutral-500">
                    Trusted by creators worldwide
                </p>
            </div>
        </>
    );
};
