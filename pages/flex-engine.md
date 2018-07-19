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

The source for Flex is publicly available here: [<i class="icon fa fa-github" aria-hidden="true" style="color: #222"></i> github.com/ajweeks/FlexEngine](https://github.com/ajweeks/FlexEngine)

Follow my progress on this project on my blog at [ajweeks.wordpress.com/tag/flex-engine](https://ajweeks.wordpress.com/tag/flex-engine)

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

<a data-fancybox="gallery" href="http://i.imgur.com/3XQGcDD.png"><img src="http://i.imgur.com/3XQGcDD.png"  width="100%"></a>
<span class="caption">A view of the editor tools showing info about scenes, objects, materials, lights, and user-settings</span>

<a data-fancybox="gallery" href="http://i.imgur.com/DYpYMhH.jpg"><img src="http://i.imgur.com/DYpYMhH.jpg"  width="100%"></a>
<span class="caption">Profiler overlay showing a breakdown the CPU-time of a single frame</span>

<a data-fancybox="gallery" href="http://i.imgur.com/LbRIVav.jpg"><img src="http://i.imgur.com/LbRIVav.jpg"  width="100%"></a>
<span class="caption">GBuffer (top-left to bottom-right): position, albedo, normal, final image, depth, metallic, AO, roughness</span>


 <a data-fancybox="gallery" href="http://i.imgur.com/qtP8Mmm.png"><img src="http://i.imgur.com/qtP8Mmm.png"  width="100%"></a>
 <a data-fancybox="gallery" href="http://i.imgur.com/oSIsXt7.png"><img src="http://i.imgur.com/oSIsXt7.png"  width="100%"></a>
 <a data-fancybox="gallery" href="http://i.imgur.com/KBCXvKs.png"><img src="http://i.imgur.com/KBCXvKs.png"  width="100%"></a>
<span class="caption">The effect different environment maps have on the same model when using image-based lighting</span>

<a data-fancybox="gallery" href="http://i.imgur.com/mqszTPr.png"><img src="http://i.imgur.com/mqszTPr.png"  width="100%"></a>

## Acknowledgments
I must extend a huge thank you to the following people and organizations for their incredibly useful resources:
 - Alexander Overvoorde of [vulkan-tutorial.com](https://vulkan-tutorial.com/)
 - Sascha Willems of [github.com/SaschaWillems/Vulkan](https://github.com/SaschaWillems/Vulkan)
 - Baldur Karlsson of [github.com/baldurk/renderdoc](https://github.com/baldurk/renderdoc)
 - Joey de Vries of [learnopengl.com](https://learnopengl.com/)
 - Andrew Maximov for the pistol model and textures [artisaverb.info/PBT.html](http://artisaverb.info/PBT.html)
 - [FreePBR.com](http://FreePBR.com) for their PBR textures
 - [hdrihaven.com](https://hdrihaven.com/) & [hdrlabs.com](http://www.hdrlabs.com/sibl/archive.html) for their HDRI maps
