---
layout: default
title:  Tangent
tags: unity, group project
permalink: /tangent/
author: AJ Weeks
---

## Tangent

- C++, DirectX 11, HLSL

Tangent is a single-player racing game I made in about a week. It utilizes the geometry shader to create geometry on the fly based on a Bézier curve. Parts of the shader are customizable at runtime (segment/iteration count, radius)

#### Notable features:
 - Bézier curve-based level generation utilizing the geometry shader stage
 - Custom post-processing effects:
   + Bloom (Multi-pass Gaussian blur, then a high pass filter, followed by a combination pass [(fx file)](https://gist.github.com/ajweeks/dac6bbe182a5ae33b07d3e07f1bbd7a4)
   + Grayscale (seen in pause menu) [(fx file)](https://gist.github.com/ajweeks/cb00bd2ce0b3fb2d5dc70d95d8924f03)


 <div class="videoWrapper">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/7_SxsQvef8I" frameborder="0" allowfullscreen></iframe>
</div>

<div>
  <a href="http://i.imgur.com/VwYWDGy.png"><img class="image" src="http://i.imgur.com/VwYWDGy.png" width="100%"/></a>
  <a href="http://i.imgur.com/2uDHB8T.jpg"><img class="image" src="http://i.imgur.com/2uDHB8T.jpg" width="49%"/></a>
  <a href="http://i.imgur.com/OYAyGNY.png"><img class="image" src="http://i.imgur.com/OYAyGNY.png" width="49%" style="float: right"/></a>
  <a href="http://i.imgur.com/4Ll0X0s.png"><img class="image" src="http://i.imgur.com/4Ll0X0s.png" width="49%"/></a>
  <a href="http://i.imgur.com/MtlwHZv.png"><img class="image" src="http://i.imgur.com/MtlwHZv.png" width="49%" style="float: right"/></a>
</div>
