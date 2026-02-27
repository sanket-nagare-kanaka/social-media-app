import React from 'react';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden pointer-events-none">
            {/* Light Mode: Animated Glass Blobs */}
            <div className="absolute inset-0 block dark:hidden bg-background transition-colors duration-500">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-500/10 blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-orange-500/10 blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Dark Mode: Moving Starfield */}
            <div className="absolute inset-0 hidden dark:block bg-[#050505] transition-colors duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
                <div className="stars-layer-1 absolute inset-0"></div>
                <div className="stars-layer-2 absolute inset-0"></div>
                <div className="stars-layer-3 absolute inset-0"></div>
            </div>
        </div>
    );
}
