---
layout: post
title:  "Rendering Engine Update 3"
date:   2017-08-16
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

<a data-fancybox="gallery" href="/assets/img/rendering-engine-04.png"><img src="/assets/img/rendering-engine-04.png" width="100%"></a>

I’ve been busy continuing work on my rendering engine when I’ve had time this summer, and added a few nice features. Around the start of the summer I stopped development of the Direct3D renderer, for a number of reasons. Mainly, having to write all graphics code not once, not twice, but thrice _really_ slows down development. Secondly, I much prefer working in OpenGL and Vulkan and the later especially seems very performant on Windows.

The most prominent new features are: diffuse mapping, specular mapping, and normal mapping. On the image to the left below you can see the regular normals, and on the right the updated normals once a normal map has been applied. Maybe adding brick textures to a teapot isn’t super realistic, but all I care about is that it works!

<a data-fancybox="gallery" href="/assets/img/rendering-engine-05.png"><img src="/assets/img/rendering-engine-05.png" width="100%"></a>
<a data-fancybox="gallery" href="/assets/img/rendering-engine-06.png"><img src="/assets/img/rendering-engine-06.png" width="100%"></a>

I’ve also done a lot of work which isn’t easily shown with just a screenshot. It’s mostly been in an attempt to allow for an arbitrary number of objects to render using an arbitrary number of shaders (or “materials”). In Vulkan there’s a surprising amount of work required to achieve this. I’m just about there, with just a few little kinks to still iron out.

<a data-fancybox="gallery" href="/assets/img/rendering-engine-07.png"><img src="/assets/img/rendering-engine-07.png" width="100%"></a>

The next few items on the to-do list are; sky boxes, a deferred pipeline, and physically based rendering. That will surely keep me busy for the next few weeks at least.
