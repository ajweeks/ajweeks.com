---
layout: post
title:  "Debugging Techniques"
tags: miscellaneous
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---
<!-- date:   2018-11-18 -->


Debugging is an inevitable part of game development, and yet I don't hear people talk about it often. Maybe that's because debugging can be a less interesting part of the development cycle than feature creation, but nonethess debugging is something you will need to do at many points throughout development, and so I think it's worth spending some time learning techniques to better tackle issues as they arrise. That is why I'm writing this post. I am rather new to the industry, but I'm hoping lessons I've learned can be taught to others, and that this will start a converation about techniques of which I am not aware.

In my experience, the hardest part of debugging is finding out exactly where an issue is occuring. If you're familiar with the codebase then finding a solution usually doesn't take too long, unless a major architecural re-write is needed to solve a much deeper-rooted issue of course. Because of that, the following techniques focus on different ways of displaying data so that you can figure out where it is you'll need to focus your attention. A well-written engine will have facilities in place to disable entire sections to help developers narrow down the cause of issues more quickly. If you can turn off AI, networking, graphics rendering, audio rendering, and other large systems individually, you'll be able to narrow down the cause of the issue much more quickly.

1. Breakpoints
These are arguably the most useful primitive tool a game programmer has access to for fixing bugs. By asking the program to pause execution at a point we specify, we are able to inspect the state of the program and hopefully see what the cause of the issue is.

2. Logging
Even more primitive than breakpoints are log statements. "Printf debugging" as it's sometimes referred to is a tried-and true method of writing things out to the console. This technique is better in some cases, like when timing is important and thus execution can not be paused, but generally I find it easier to solve more issues using breakpoints since you can inspect any value, rather than just the ones you decided to print before compiling.

3. Graphics debugger
When working on graphics, many things can cause the screen to go black, objects to disappear, or things to just misbehave in any number of ways. Most often in these cases I go to [RenderDoc](https://renderdoc.org/). It allows me to inspect meshes and textures at every point in the pipeline and even debug shader code line by line (DirectX-only though :cry:). Once you're familiar with the tool, debugging graphics issues with it becomes a breeze.

4. Visual checking
In some cases knowing if a particular object has changed state is important, and one way of making this obvious is changing that object's material to be, for example, a bright pink. This makes finding the issue objects much quicker than say, inspecting a log, looking up that object in the scene graph, and finally finding it in the scene. In a similar vein, outputting particular values in your shader can be a good way to find erroneous states. For example, rendering your scaled and biased normals out as if they were colours can allow you to quickly inspect if they are as you expect them to be.

5. Data breakpoints
Rather than pausing execution on a particular line, most debuggers allow you to pause execution when a certain memory location is written to. This can be handy when you're not sure what piece of code is changing a particular value.

6. Value histogram
Certain issues are best visualized over time, and by having a system in place which can graph them you can sometimes spot obviously incorrect behaviour which would otherwise be lost in a plain log or on-screen message.

7.


I'm sure I've missed many techniques here, let me know your favorite technique below or here: [@liqwidice])(https://twitter.com/liqwidice).
