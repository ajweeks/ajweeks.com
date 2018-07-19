---
layout: post
title:  "Flex Engine Update 4"
date:   2017-10-05
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

Since the last post, I’ve decided on a name for this project – Flex Engine! I basically decided on it because it sounded neat, it’s short, and it’s easy to remember. However, as other people have pointed out it’s actually quite fitting to the project itself since both OpenGL and Vulkan are supported the engine is kind of Flexible.

Other than deciding on a name, I’ve also made quite a bit of real progress on the engine. Starting about two weeks ago I began working full-time on the project, which is letting me progress much faster. As mentioned at the end of the previous entry, the next items on my to-do list were; skyboxes, deferred shading, and Physically Based Rendering, or PBR. Skyboxes were quickly checked off the list, then I moved on to the other two.

I started off the full-time period by finishing the final bits of deferred shading. I then began tackling PBR. If you haven’t heard of it, it’s basically just an alternative set of techniques used for lighting objects. The typical “beginner” algorithm used for lighting calculations is called Blinn-Phong, and while it works alright, it’s about forty years old and we can do much better.

<div width="100%">
  <a data-fancybox="gallery" href="/assets/img/flex-engine-10.jpg"><img src="/assets/img/flex-engine-10.jpg" width="49%"></a>
  <a data-fancybox="gallery" href="/assets/img/flex-engine-11.jpg"><img src="/assets/img/flex-engine-11.jpg" width="49%"></a>
  <span class="caption">PBR (left), Blinn-Phong (right)</span>
</div>

While this comparison is slightly exaggerated since the textures were authored using the PBR workflow, one clearly looks more like a rusted iron ball.

After that was implemented in both OpenGL and Vulkan, I moved on to adding support for a feature commonly associated with PBR – Image Based Lighting, or IBL. It is an attempt to take into account the environment’s effect on an object’s final color. It adds a great deal of realism and it really makes PBR shine.

<a data-fancybox="gallery" href="/assets/img/flex-engine-12.jpg"><img src="/assets/img/flex-engine-12.jpg" width="100%"></a>
<span class="caption">Progress on IBL (not quite there yet)</span>

Once IBL is fully implemented in both APIs, I will begin working on adding support for reflection probes. The general idea is this: instead of sampling a global cubemap for all objects (like above), individual snapshots of different parts of the world are taken and then used depending on each object’s position. One example of why this is needed is seeing reflections of clouds on objects that are indoors tends to look a bit off. Reflection probes can be placed around the world (some inside, some outside) and objects will use a blend of the nearest cubemap captures to create more realistic reflections. Stay tuned for updates on that!
