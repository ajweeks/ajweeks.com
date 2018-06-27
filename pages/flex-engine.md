---
layout: default
title:  Flex Engine
tags: 3D, vulkan, opengl, graphics, engine, cpp
permalink: /flex-engine/
author: AJ Weeks
---

## Flex Engine

- C++, Vulkan, OpenGL

Flex Engine is my personal rendering/game engine which currently supports Vulkan and OpenGL. It was started in February 2017 as a way for me to better understand how rendering engines work. Recently I've been more focused on adding support for various gameplay features like audio, player input, physics, and UI.

You can find the entire source code on my GitHub [<i class="icon fa fa-github" aria-hidden="true" style="color: #222"></i> github.com/ajweeks/FlexEngine](https://github.com/ajweeks/FlexEngine)

Follow my progress on this project on my blog at [ajweeks.wordpress.com/tag/flex-engine](https://ajweeks.wordpress.com/tag/flex-engine)

##### Notable features:
 - Support for both Vulkan and OpenGL, switchable at runtime
 - Physically Based Rendering (PBR)
 - Image Based lighting
 - Irradiance map generation
 - Reflection probes
 - Post-processing stage (contrast/brightness control, anti-aliasing, )
 - Audio playback
 - Physics simulation
 - Player input handling (keyboard/mouse/gamepad)
 - Custom level save file parsing/serializing (with support for prefabs)

#### Planned Features
 - Mesh animation
 - Cascading shadow maps
 - ...

 <a data-fancybox="gallery" href="http://i.imgur.com/qtP8Mmm.png"><img src="http://i.imgur.com/qtP8Mmm.png"  width="100%"></a>
 <a data-fancybox="gallery" href="http://i.imgur.com/oSIsXt7.png"><img src="http://i.imgur.com/oSIsXt7.png"  width="100%"></a>
 <a data-fancybox="gallery" href="http://i.imgur.com/KBCXvKs.png"><img src="http://i.imgur.com/KBCXvKs.png"  width="100%"></a>

<div style="display: inline-block; padding-bottom: 20px">
  <a data-fancybox="gallery" href="http://i.imgur.com/ACLLZ5B.png"><img src="http://i.imgur.com/ACLLZ5B.png"  width="49%"></a>
  <a data-fancybox="gallery" href="http://i.imgur.com/e0mKpDX.png"><img src="http://i.imgur.com/e0mKpDX.png"  width="49%" style="float: right"></a>
</div>

<a data-fancybox="gallery" href="http://i.imgur.com/mqszTPr.png"><img src="http://i.imgur.com/mqszTPr.png"  width="100%"></a>

## Thanks
A huge thanks to the following people/organizations for their incredibly useful resources:
 - Alexander Overvoorde of [vulkan-tutorial.com](https://vulkan-tutorial.com/)
 - Sascha Willems of [github.com/SaschaWillems/Vulkan](https://github.com/SaschaWillems/Vulkan)
 - Baldur Karlsson of [github.com/baldurk/renderdoc](https://github.com/baldurk/renderdoc)
 - Joey de Vries of [learnopengl.com](https://learnopengl.com/)
 - Andrew Maximov for the pistol model and textures [artisaverb.info/PBT.html](http://artisaverb.info/PBT.html)
 - [FreePBR.com](http://FreePBR.com) for their PBR textures
 - [hdrihaven.com](https://hdrihaven.com/) & [hdrlabs.com](http://www.hdrlabs.com/sibl/archive.html) for their HDRI maps
