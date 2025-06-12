# IDEA9103-Creative-coding-major-project（Audio）

## Instructions for use
- **Click the “Play/Stop Music” button** in the top-left corner to start or stop the music.
- When the music plays:
  - **Particles automatically generate and respond to music amplitude** (volume level)
  - **Particle speed, size, and quantity** dynamically change with the rhythm
  - You can also **click the mouse** to manually create particles at that position
- When the music stops:
  - Existing particles **gracefully fade out** and no new particles are generated

### Details about My Personal Approach to the Animation Group Code

I chose **audio** as the driving force for my individual animation contribution.

The **background portion** of the image is animated, and the particles within that layer **respond dynamically to the loudness of the music**:

- 🎵 The **movement speed** of particles increases as the volume rises
- 🎵 The **size** of particles scales proportionally with amplitude
- 🎵 The **number of particles** automatically generated during each audio burst is based on the real-time volume level

The **visual effects** of particle trajectories are animated using `p5.Vector`, with `HSB` color mode enabled for vibrant color transitions:

- The **transparency (alpha)** of each trail point gradually fades, creating a **motion blur effect**
- Particles achieve **unique and natural movement** by combining amplitude-driven **motion speed** and **density control**

These behaviors contribute to a sound-reactive background that maintains dynamic harmony with the static peace dove drawing in the center.