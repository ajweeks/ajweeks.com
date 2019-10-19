---
layout: default
title:  Tangent
tags: unity, group project
permalink: /tangent/
author: AJ Weeks
---

## Tangent
###### 2017

- C++, DirectX 11, HLSL

Tangent is a single-player racing game I made in about **one week**. It utilizes the **geometry shader** to create geometry on the fly based on a Bézier curve. Parts of the shader are customizable at runtime. (segment/iteration count, radius) I made this project as a way to better understand the geometry shader stage, and to improve my understanding of graphics programming.

#### Notable features:
 - Realtime **Bézier curve-based level generation** utilizing the geometry shader stage
 - Custom post-processing effects:
   + **Bloom** - Multi-pass Gaussian blur, then a high pass filter, followed by a combination pass <i class="icon fa fa-github" aria-hidden="true" style="color: #222"></i> [shader code](https://gist.github.com/ajweeks/dac6bbe182a5ae33b07d3e07f1bbd7a4)
   + **Grayscale** (seen in pause menu) <i class="icon fa fa-github" aria-hidden="true" style="color: #222"></i> [shader code](https://gist.github.com/ajweeks/cb00bd2ce0b3fb2d5dc70d95d8924f03)
 - Exploding player mesh on collision


 <div class="videoWrapper">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/7_SxsQvef8I" frameborder="0" allowfullscreen></iframe>
</div>

<div>
  <a data-fancybox="gallery" href="/assets/img/tangent-menu.jpg"><img src="/assets/img/tangent-menu.jpg" width="100%"></a>
  <a data-fancybox="gallery" href="/assets/img/tangent-01.jpg"><img src="/assets/img/tangent-01.jpg" width="49%"></a>
  <a data-fancybox="gallery" href="/assets/img/tangent-04.jpg"><img src="/assets/img/tangent-04.jpg" width="49%" style="float: right"></a>
  <a data-fancybox="gallery" href="/assets/img/tangent-02.jpg"><img src="/assets/img/tangent-02.jpg" width="49%"></a>
  <a data-fancybox="gallery" href="/assets/img/tangent-03.jpg"><img src="/assets/img/tangent-03.jpg" width="49%" style="float: right"></a>
</div>
