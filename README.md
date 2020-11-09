## WebGL Particle System

A particle system implemented in WebGL utilising a Frame-Buffer-Object (FBO) approach for efficient renderering.
Implementation was heavily inspired by **the** original WebGL FBO system on the web http://barradeau.com/blog/?p=621.

The simulation is written with Three.js and utilises a pair of off-screen render-targets and a 'ping-pong' rendering 
approach to efficiently utilise the GPU for computation.  At each step an appropriate shader is selected on the FBO 
mesh, and the renderer reads from the texture on one render target, and renders into the other. At the next step the 
targets are swapped.

On a computer with an NVIDIA 1070 and AMD Ryzen 5 2600, the system easily handled displaying 16,777,216 (4096^2) static 
particles at ~30 FPS, static in this context meaning a shader displaying the particles in place without velocity, 
rather than disabling camera rotation.   

### Running

This project is written in a mixture of Typescript and Javascript and uses Webpack + Babel for development. 

To develop:
* Run `npm install` to install dependencies
* Run `npm run start:dev` to start the development server on port 8080 (this can be changed in the package.json)
