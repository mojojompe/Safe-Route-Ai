"use client";
import { useEffect, useRef } from "react";
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
    // const pointerInteracting = useRef(null);
    // const pointerInteractionMovement = useRef(0);
    const [{ r }] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
        window.addEventListener('resize', onResize)
        onResize()
        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: markers.map(m => ({ location: [m.lat, m.lng], size: 0.05 })),
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi + r.get()
                phi += 0.01
                state.width = width * 2
                state.height = width * 2
            },
            ...config
        })
        setTimeout(() => canvasRef.current!.style.opacity = '1')
        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        }
    }, [markers, config, r])

    return (
        <div style={{
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
    )
}
