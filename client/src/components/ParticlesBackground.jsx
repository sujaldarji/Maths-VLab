<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles loaded:", container);
  };

  const options = useMemo(
    () => ({
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: { enable: true },
          value: 80,
        },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <div style={{ 
        position: "absolute",
        width: "100%",
        height: "100%",
      }}>
        <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />
      </div>
  );
};

export default ParticlesComponent;
>>>>>>> 59d7a14 (sample content for algebra topic)
