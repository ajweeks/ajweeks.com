---
layout: default
title:  Flex Engine
tags: 3D, vulkan, opengl, graphics, engine, cpp, c++
permalink: /flex-engine/
author: AJ Weeks
---

## Flex Engine
###### 2017-Present

- C++, Vulkan, OpenGL

Flex Engine is my personal game engine which I began work on in February 2017 as a playground for learning about real-time technology. During the first year of development I focused on the renderer, after which I began adding support for the plethora of other necessary systems that a game engine requires (such as audio, player input, physics, and UI.)

Find the source for Flex at: <a class="underline" href="https://github.com/ajweeks/FlexEngine"><i class="icon fa fa-github" aria-hidden="true" style="color: #222"></i> github.com/ajweeks/FlexEngine</a>

Follow my progress on this project on my blog at <a class="underline" href="https://ajweeks.com/blog">ajweeks.com/blog</a>

#### Notable Features
- Support for both Vulkan and OpenGL, switchable at runtime
- Physically Based Rendering (PBR)
- Image Based lighting (IBL)
- Reflection probes
- Scene editor
- Scene serialization
- Profiling tools
- Signed-distance field font generation & rendering
- Post-processing stage
- Physics simulation
- Audio playback

<a data-fancybox="gallery" href="/assets/img/flex-engine-editor.png"><img src="/assets/img/flex-engine-editor.png"  width="100%"></a>
<span class="caption">A view of the editor tools showing info about scenes, objects, materials, lights, and user-settings</span>

<a data-fancybox="gallery" href="/assets/img/flex-engine-profiler.jpg"><img src="/assets/img/flex-engine-profiler.jpg"  width="100%"></a>
<span class="caption">Profiler overlay showing a breakdown the CPU-time of a single frame</span>

<a data-fancybox="gallery" href="/assets/img/flex-engine-gbuf.jpg"><img src="/assets/img/flex-engine-gbuf.jpg"  width="100%"></a>
<span class="caption">GBuffer (top-left to bottom-right): position, albedo, normal, final image, depth, metallic, AO, roughness</span>

 <a data-fancybox="gallery" href="/assets/img/flex-engine-guns-01.jpg"><img src="/assets/img/flex-engine-guns-01.jpg"  width="100%"></a>
 <a data-fancybox="gallery" href="/assets/img/flex-engine-guns-02.jpg"><img src="/assets/img/flex-engine-guns-02.jpg"  width="100%"></a>
 <a data-fancybox="gallery" href="/assets/img/flex-engine-guns-03.jpg"><img src="/assets/img/flex-engine-guns-03.jpg"  width="100%"></a>
<span class="caption">The effect different environment maps have on the same model when using image-based lighting</span>

<a data-fancybox="gallery" href="/assets/img/flex-engine-rotate.gif"><img src="/assets/img/flex-engine-rotate.gif"  width="100%"></a>

## Acknowledgments
I must extend a huge thank you to the following individuals and organizations for their incredibly useful resources:
 - Alexander Overvoorde of <a class="underline" href="https://vulkan-tutorial.com/">vulkan-tutorial.com</a>
 - Sascha Willems of <a class="underline" href="https://github.com/SaschaWillems/Vulkan">github.com/SaschaWillems/Vulkan</a>
 - Baldur Karlsson of <a class="underline" href="https://renderdoc.org/">renderdoc.org</a>
 - Joey de Vries of <a class="underline" href="https://learnopengl.com/">learnopengl.com
 - Andrew Maximov for the pistol model and textures <a class="underline" href="https://artisaverb.info/PBT.html">artisaverb.info/PBT.html</a>
 - <a class="underline" href="https://FreePBR.com">FreePBR.com</a> for their PBR textures
 - <a class="underline" href="https://hdrihaven.com/">hdrihaven.com</a> & <a class="underline" href="https://www.hdrlabs.com/sibl/archive.html">hdrlabs.com</a> for their HDRI maps
