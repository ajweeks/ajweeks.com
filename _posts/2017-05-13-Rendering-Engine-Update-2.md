---
layout: post
title:  "Rendering Engine Update 2 – OpenGL & Vulkan Feature Parity"
date:   2017-05-13
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

I finally managed to coerce Vulkan to render multiple objects simultaneously! I’ve been super busy over the past few weeks working on other assignments, but I decided to devote the entirety of today to finishing up this feature. As odd as it may sound, rendering more than one object in Vulkan at the same time is significantly harder than rendering just one at a time. That is, unless you design the engine to handle multiple objects from the beginning. Seeing as I knew hardly anything about Vulkan at the start of all this, I was relying pretty heavily on sources I could find online to get a base under my feet. That base was provided mostly by Alexander Overvoorde’s <a class="underline" href="https://vulkan-tutorial.com/">Vulkan-Tutorial.com</a>. It’s a very helpful tutorial series to get started with Vulkan, as it explains every line and covers the basics. However, even after following the entire series, you’ll have a pretty rigid engine. If you want to have any flexibility whatsoever you’ll need to still need to do quite a bit of work.

I then found Sascha Willems’ fantastic <a class="underline" href="https://github.com/SaschaWillems/Vulkan">Vulkan examples repository</a>. It contains examples for nearly every rendering engine feature you’d want, all nicely separated by feature. Today I was mainly looking at how he implemented his vertex and command buffers, but I’ll surely be spending quite a bit more time in the future looking at various other parts of the code base.

There is small issue in my Vulkan renderer currently; everything is flipped horizontally relative to the OpenGL renderer. This is caused by the coordinate system Vulkan uses by default being different from the one OpenGL uses - it shouldn’t be terribly difficult to fix though.

<div width="100%">
  <a data-fancybox="gallery" href="/assets/img/rendering-engine-02.png"><img src="/assets/img/rendering-engine-02.png" width="49%"></a>
  <a data-fancybox="gallery" href="/assets/img/rendering-engine-03.png"><img src="/assets/img/rendering-engine-03.png" width="49%"></a>
  <span class="caption">Vulkan and OpenGL rendering the same scene</span>
</div>

The next step is to get Direct3D rendering the same thing as the other two APIs. After that I'd like to start to encapsulate some of the Vulkan objects into helper classes to clean up the code. I can then finally start to add more interesting features like post processing shaders and a basic GUI. With how many other big assignments I have due in the next month that likely won’t be happening anytime soon, but I hope to find time after that.
