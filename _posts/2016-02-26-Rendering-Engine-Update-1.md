---
layout: post
title:  "Rendering Engine Update 1 - Project Creation"
date:   2016-02-26
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

<a data-fancybox="gallery" href="/assets/img/rendering-engine-01.png"><img src="/assets/img/rendering-engine-01.png" width="100%"></a>

This semester for our Programming 4 class, we have two semester-long assignments. One is to create a classic DOS-inspired text adventure game, and the other is to create a small, high quality tech demo.

I may post about the text adventure project at some point, but at the moment I’m much more interested in the tech demo, so that’s mostly what you’ll be seeing here.

The tech demo project is very open-ended, the requirements are simply; have a finished application at the end of the semester, written in C++. In some way I wish we had more restrictions, after all as Orson Welles once wisely said, _“The enemy of art is the absence of limitations”_. At the same time, having the freedom to work on whatever you wish to is great since you won’t be forced to work on something you aren’t interested in.

For my project I decided to compare graphics APIs, namely at least OpenGL, Direct3D, and Vulkan. The overarching goal is to learn more about each API, and more specifically to learn about their differences; in the shader code, linking, initialization, and rendering. I have used OpenGL/GLSL a handful of times in the past, and we’ve been using Direct3D/HLSL for the past semester, but I’ve never had a clean slate where I could compare the two effectively. I know next to nothing about Vulkan, but I’m looking forward to learning a lot about it.

Another big goal of the project is to learn how to design components in an API-agnostic kind of way. I’m aiming to get the project to the point where I can add an additional API without touching any game code.

Since my objective with this project is to learn about graphics APIs, and not the internal structure of a png image (not that that doesn’t interest me!), I’m going to be using various libraries. So far I’ve used:

- <a class="underline" href="http://www.glfw.org/">GLFW</a> (for linking to OpenGL)
- <a class="underline" href="http://glm.g-truc.net">GLM</a> (for matrix & vector math functions)
- <a class="underline" href="https://github.com/Dav1dde/glad">GLAD</a> (for loading library extensions)
- <a class="underline" href="http://www.lonesock.net/soil.html">SOIL</a> (for loading images)

I initially tried to get the project building using <a class="underline" href="https://cmake.org">cmake</a>, with the hopes of reducing the headache of trying to setup the project on another workstation (i.e. my teacher’s). After spending several hours without having any luck, I decided to simply use Visual Studio, as that was what I was used to, and I know that all my teachers all definitely know how to use it. I would like to try again in the future to get everything building using cmake.

I would also like to take a look at integrating <a class="underline" href="https://travis-ci.org/">Travis-CI</a> for running tests automatically, mostly just so that I know how to do it more than anything else. I don’t think I’ll get much use out of it on this project,  but I think it would be good to experience all that needs to be done to get a project building using it.

The next item on the to-do list is integrating Direct3D, stay tuned for updates on that!
