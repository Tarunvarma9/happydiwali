import React, { useEffect, useRef, useState } from 'react';
import './Fireworks.css';

const Fireworks = () => {
    const canvasRef = useRef(null);
    const [textColor, setTextColor] = useState('white'); // Initial text color

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size to fit the window dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Fireworks and particle settings
        const fireworks = [];
        const particles = [];
        const partCount = 80;  // Number of particles per firework
        const partSpeed = 4;   // Speed of particles
        const partSpeedVariance = 2;
        const fworkSpeed = 5;  // Initial speed of fireworks
        const fworkAccel = 1.05; // Firework acceleration factor
        const clearOpacity = 0.1;  // Adjust opacity for smoother fade-out

        // Helper function to get a random number between a range
        const rand = (min, max) => Math.random() * (max - min) + min;

        // Create a new firework that moves to a target location
        const createFirework = (startX, startY, targetX, targetY) => {
            const firework = {
                x: startX,
                y: startY,
                startX,
                startY,
                targetX,
                targetY,
                speed: fworkSpeed,
                angle: Math.atan2(targetY - startY, targetX - startX),
                acceleration: fworkAccel,
                hue: rand(0, 360),
                brightness: rand(50, 80),
                alpha: 1
            };
            fireworks.push(firework);
        };

        // Create particles at the target explosion point
        const createParticles = (x, y) => {
            for (let i = 0; i < partCount; i++) {
                const angle = rand(0, 360); // Random angle for each particle
                const particle = {
                    x,
                    y,
                    angle, // Use random angle
                    speed: rand(partSpeed - partSpeedVariance, partSpeed + partSpeedVariance),
                    friction: 0.98,
                    gravity: 0.1,
                    hue: rand(0, 360),
                    brightness: rand(50, 80),
                    alpha: 1,
                    decay: 0.015
                };
                particles.push(particle);
            }
        };

        const updateFireworks = () => {
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const firework = fireworks[i];

                // Move firework
                firework.x += Math.cos(firework.angle) * firework.speed;
                firework.y += Math.sin(firework.angle) * firework.speed;
                firework.speed *= firework.acceleration; // Apply acceleration

                // Check if firework has reached its target position
                const distanceToTarget = Math.hypot(firework.targetX - firework.x, firework.targetY - firework.y);
                if (distanceToTarget < 10) {
                    createParticles(firework.x, firework.y); // Create particles at target
                    fireworks.splice(i, 1); // Remove firework after explosion
                }
            }
        };

        const updateParticles = () => {
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];

                // Update particle position
                particle.x += Math.cos(particle.angle * Math.PI / 180) * particle.speed;
                particle.y += Math.sin(particle.angle * Math.PI / 180) * particle.speed;
                particle.speed *= particle.friction;  // Apply friction to reduce speed
                particle.y += particle.gravity;       // Apply gravity
                particle.alpha -= particle.decay;     // Fade out particle

                // Remove particle if it becomes nearly invisible
                if (particle.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
        };

        const draw = () => {
            // Apply a semi-transparent overlay to create a smooth fade-out effect without blinking
            ctx.fillStyle = `rgba(0, 0, 0, ${clearOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw fireworks
            fireworks.forEach((firework) => {
                ctx.beginPath();
                ctx.moveTo(firework.startX, firework.startY);
                ctx.lineTo(firework.x, firework.y);
                ctx.strokeStyle = `hsl(${firework.hue}, 100%, ${firework.brightness}%)`;
                ctx.stroke();
            });

            // Draw particles
            particles.forEach((particle) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.alpha})`;
                ctx.fill();
            });
        };

        const loop = () => {
            updateFireworks();
            updateParticles();
            draw();
            requestAnimationFrame(loop);
        };

        loop();

        // Firework effect on click
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const targetX = Math.min(Math.max(e.clientX - rect.left, 0), canvas.width);
            const targetY = Math.min(Math.max(e.clientY - rect.top, 0), canvas.height);

            // Prevent creating fireworks going out of bounds
            createFirework(canvas.width / 2, canvas.height, targetX, targetY);

            // Change text color temporarily to a random color on click
            const newColor = `hsl(${rand(0, 360)}, 100%, 50%)`;
            setTextColor(newColor);

            // // Reset text color back to white after a short delay
            // setTimeout(() => {
            //     setTextColor('white');
            // }, 500); // Change duration as needed
        };

        // Attach click event listener
        canvas.addEventListener('click', handleClick);

        // Cleanup event listener on component unmount
        return () => {
            canvas.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <>
           <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}></canvas>
            <h1 className="red-text" style={{ color: textColor, textAlign: 'center', marginTop: '20px' }}>
                H,<br /> Happy Diwali
            </h1>
            <span className="center-text" style={{ display: 'block', textAlign: 'center' }}>Click on the screen</span>
        </>
    );
};

export default Fireworks;
