import { Check } from "lucide-react";

export const RightContent = ({ title, desc }) => {
    const features = [
        "Fast image generation",
        "Saved project gallery",
    ];

    return (
        <>
            {/* Decorative Elements */}
            <div className="absolute top-14 right-12 h-28 w-28 rounded-full border-[18px] border-purple-500/10 animate-pulse" />
            <div className="absolute bottom-14 right-30 h-20 w-20 rounded-full border-[18px] border-purple-500/10 animate-pulse" />


            <div className="absolute bottom-16 left-16 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />

            <div className="absolute top-1/3 left-24 h-24 w-24 rounded-full bg-accent-pink/30 blur-2xl" />

            {/* Content */}
            <div className="relative z-10 max-w-lg text-center">

                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-accent-violet" />

                    <span className="text-sm font-medium text-neutral-200">
                        AI Powered Platform
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-white">
                    {title}
                </h1>

                {/* Description */}
                <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-neutral-300">
                    {desc}
                </p>

                {/* Features */}
                <div className="grid gap-4">
                    {features.map((item) => (
                        <div
                            key={item}
                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-card-hover"
                        >
                            {/* Icon */}
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-hover shadow-inner">
                                <Check
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                />
                            </div>

                            {/* Text */}
                            <h3 className="text-base font-semibold text-neutral-100">
                                {item}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <p className="mt-10 text-sm text-neutral-400">
                    Trusted by creators worldwide
                </p>
            </div>
        </>
    );
};