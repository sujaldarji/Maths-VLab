import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Correct import

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        console.log("Particles Engine Loaded:", engine);
        await loadSlim(engine); // Correct initialization
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: true, zIndex: -1 }, // Full-screen particles
                background: { color: "#ffffff" }, // White background
                particles: {
                    number: { value: 80, density: { enable: true, area: 800 } },
                    color: { value: "#1e3a8a" }, // Royal blue particles
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 5, random: true },
                    move: { enable: true, speed: 2, direction: "none", outModes: "out" }, // Fix: `outModes` instead of `outMode`
                    links: { enable: true, distance: 150, color: "#1e3a8a", opacity: 0.5 },
                },
                interactivity: {
                    events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } },
                    modes: { repulse: { distance: 100 }, push: { quantity: 4 } }, // Fix: `particles_nb` should be `quantity`
                },
            }}
        />
    );
};

export default ParticlesBackground;
