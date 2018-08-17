---
layout: post
title:  "Flex Engine Update 5"
date:   2018-07-03
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

It has been a while since the <a class="underline" href="/blog/2017/10/05/Flex-Engine-Update-4/">last update</a> (almost nine months!), and a lot has changed in that time! I finished adding support for image-based lighting and reflection probes, then after a short break I came back to the project and decided to shift my goal with it from being to create a tool to learn graphics APIs with to now creating a game with. To that end, I’ve temporarily suspended support for Vulkan and left OpenGL as the primary graphics API being used while I focus on adding support for gameplay systems.

Having a concrete goal to aim for has proven very useful for a number of reasons, the biggest of which being the restrictions a game places on the engine’s features. Any feature that doesn’t directly improve the game is immediately cut. By not making any assumptions about what _might_ be needed in the future, and instead only implementing features which are necessary right now, I ensure that my time is spent directly benefiting the game.

The main features I’ve implemented since the last update include _scene serialization_, _audio playback_, _text rendering_, _post-processing_, and _physics simulation_.

To serialize a scene I write all objects, materials, and lights to a JSON file. I first added a JSON parser/writer, and then I added support for saving the various types of objects (simple meshes, physics data, reflection probes, the skybox, …). Recently I added a distinction between a user-saved file and the default scene layout. This way a player can go through the game and save their progress, while at any time being able to “restart” and erase all their progress. I also added support for saving out “prefabs” to individual files, which can be instantiated into scenes without duplicating the shared fields. I also added a translation gizmo which is displayed on top of the currently selected object to make moving objects around the scene easier.

<a data-fancybox="gallery" href="/assets/img/flex-engine-13.gif"><img src="/assets/img/flex-engine-13.gif" width="100%"></a>

For audio playback I’m using <a class="underline" href="https://www.openal.org/">OpenAL</a>. So far I’ve just added bare-bones support with no mixing or fancy controls – just playing, pausing, and stopping sounds and setting volume and pitch.

<a data-fancybox="gallery" href="/assets/img/flex-engine-14.png"><img src="/assets/img/flex-engine-14.png" width="60%" style="display: block; margin: 0 auto"></a>
<br />

To load fonts I’m using <a class="underline" href="https://www.freetype.org/">FreeType</a>, and then generating a signed distance-field font atlas per variant at startup. Signed distance-field fonts are great at drawing text at different sizes without loss of detail, which is why I chose to add support for them. I'm planning on eventually saving the generated atlas out to disk and then loading in that texture on successive runs, rather than generate it on each bootup.

<div width="100%">
  <a data-fancybox="gallery" href="/assets/img/flex-engine-15.jpg"><img src="/assets/img/flex-engine-15.jpg" width="79%"></a>
  <a data-fancybox="gallery" href="/assets/img/flex-engine-16.jpg"><img src="/assets/img/flex-engine-16.jpg" width="19.5%"></a>
  <span class="caption">Signed distance-field font atlas, utilizing four colour channels (right: combined)</span>
</div>
<br />

I’ve added handful of post-processing effects thus far including basic contrast, brightness, and saturation control, tone-mapping,  gamma-correction, “fast approximate anti-aliasing”, and chromatic aberration. Those effects already give me a lot of control over the final image, but I’ll definitely be adding more effects as time goes on, including a better AA solution, bloom, and screen-space ambient occlusion among others.

<a data-fancybox="gallery" href="/assets/img/flex-engine-17.jpg"><img src="/assets/img/flex-engine-17.jpg" width="100%"></a>
<span class="caption">Some different looks I’m able to achieve by tweaking contrast, brightness, and saturation</span>
<br />

For physics simulation I’m using <a class="underline" href="http://bulletphysics.org/wordpress/">Bullet</a>. It was quite a simple addition to the project which just required adding some boilerplate initialization and destruction code and a wrapper for rigid bodies.

<a data-fancybox="gallery" href="/assets/img/flex-engine-18.png"><img src="/assets/img/flex-engine-18.png" width="60%" style="display: block; margin: 0 auto"></a>
<br />

Besides those features I’ve made lots of small changes and additions, including adding gamepad support, basic profiling helpers, and several configuration files which are super helpful for saving user-specific state between sessions.

Going forward I’ll be continuing to focus on implementing and improving gameplay-systems and hopefully getting closer to having a fun game.
