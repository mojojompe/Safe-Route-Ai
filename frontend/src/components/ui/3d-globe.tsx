"use client";
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useSpring } from "react-spring";

export interface GlobeMarker {
    lat: number;
    lng: number;
    src?: string;
    label?: string;
}

export function Globe3D({ markers, config }: {
    markers: GlobeMarker[];
    config?: any;
    onMarkerClick?: (marker: GlobeMarker) => void;
    onMarkerHover?: (marker: GlobeMarker | null) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [{ r }] = useSpring(() => ({
        r: 0,
        config: { mass: 1, tension: 280, friction: 40, precision: 0.001 },
    }));

    // Defer globe init until it's scrolled into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { rootMargin: '100px' }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();
        // Use DPR=1 for non-retina screens; halve mapSamples for ~50% faster render
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: dpr,
            width: width * dpr,
            height: width * dpr,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 8000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: markers.map(m => ({ location: [m.lat, m.lng], size: 0.05 })),
            onRender: (state) => {
                state.phi = phi + r.get();
                phi += 0.01;
                state.width = width * dpr;
                state.height = width * dpr;
            },
            ...config
        });
        setTimeout(() => { if (canvasRef.current) canvasRef.current.style.opacity = '1'; });
        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [isVisible, markers, config, r]);

    return (
        <div ref={containerRef} style={{
            width: '100%',
            maxWidth: 600,
            aspectRatio: 1,
            margin: 'auto',
            position: 'relative',
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                }}
            />
        </div>
    );
}
