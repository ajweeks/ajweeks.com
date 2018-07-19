---
layout: post
title:  "Rubik's Cube Simulator"
date:   2016-03-16
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

<a data-fancybox="gallery" href="/assets/img/rubiks-13.gif"><img src="/assets/img/rubiks-13.gif" width="100%"></a>

Last semester I got my first experience with 3D programming – something I had wanted to learn how to do for quite a while. One of our first assignments was to  get a handful of primitives moving around on screen (first screenshot below). I was motivated enough to continue expanding the project, and added 9 smaller cubes that formed a larger cube, along with a large sky-box-like cube.

<a data-fancybox="gallery" href="/assets/img/rubiks-05.png"><img src="/assets/img/rubiks-05.png" width="100%"></a>
<a data-fancybox="gallery" href="/assets/img/rubiks-06.png"><img src="/assets/img/rubiks-06.png" width="100%"></a>

Once I got to that point, I figured – why not take it further? I started thinking about how I could get the “Rubik’s cube” to rotate like the real thing.

<a data-fancybox="gallery" href="/assets/img/rubiks-07.png"><img src="/assets/img/rubiks-07.png" width="100%"></a>

After many hours of trying, and several note pad pages full of indices and diagrams …

<a data-fancybox="gallery" href="/assets/img/rubiks-08.jpg"><img src="/assets/img/rubiks-08.jpg" width="100%"></a>

… I still couldn’t get it to work.

<a data-fancybox="gallery" href="/assets/img/rubiks-09.png"><img src="/assets/img/rubiks-09.png" width="100%"></a>

I thought I’d take a break from the rotation code and fix the colours so that the inside faces were black.

<a data-fancybox="gallery" href="/assets/img/rubiks-10.png"><img src="/assets/img/rubiks-10.png" width="100%"></a>

But I could only prolong the inevitable long hall of getting stackable rotations working that was ahead of me – and long it was.

<a data-fancybox="gallery" href="/assets/img/rubiks-11.png"><img src="/assets/img/rubiks-11.png" width="100%"></a>

However, after many hours I found a solution! In the end I found rotation matrices to be the ideal tool for stacking multiple rotations together, combined with some rather messy index swapping after each rotation.

I decided to add a textured plane that cut through the cube which to show the controls for rotating the layers. Printing the controls out like this made clear just how ridiculous they were – the next step was to replace them with something more sane.

<a data-fancybox="gallery" href="/assets/img/rubiks-12.png"><img src="/assets/img/rubiks-12.png" width="100%"></a>

Fast forward several months and I've finally found the time to improve the input method. Now, instead of pressing one of a dozen keys to rotate a layer, you simply click on the layer you want to rotate; left click for clockwise rotations, right for anti-clockwise.

<a data-fancybox="gallery" href="/assets/img/rubiks-13.gif"><img src="/assets/img/rubiks-13.gif" width="100%"></a>

I also added the ability to begin randomly scrambling the cube on a key press (shown in the gif), and instantly solve it by pressing another.

Like with any project, there are things I’d like to fix and lots of things I’d like to add, but I have to call it at some point, and I think this is that point for this project. I have plenty of other projects going on at the moment, plus it feels great to have another one in the “finished” list.

Thanks for reading! I’ll be back soon with another post on my graphics API comparison project.
