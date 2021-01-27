---
path: js-in-depth1
date: 2021-01-27T00:41:09.507Z
title: 'JS in Depth: Types, Objects and Deep Copy'
description: >-
  This is the first part of a series I'm calling JS in Depth, where I try to
  focus on a selection of important and what I consider to be in-depth knowledge
  about JavaScript.
tag: engineering
---
This is the first part of a series I'm calling JS in Depth, where I try to focus on a selection of important and what I consider to be in-depth knowledge about JavaScript. I am well aware of the fact that there is no shortage of good materials on JavaScript fundamentals and I have no interest in repeating them, nor will I cover every little aspect of the languages in this series. Therefore, this is not going to be a tutorial for people who just started or have little experience with JavaScript, although I will try to link references for the terms or techniques mentioned in the article and I encourage you to search for definitions yourself.



In this blog post I am going to cover data types in JavaScript, especially Objects, and ways to tell which type is stored in a variable and finally I will put these concepts together by writing out a deep copy util function by hand without using any 3rd party libraries. There are tons of tutorials with deep copy implementations out there on internet but the one that I am presenting in this blog post could be one of the best solutions, if not the best.



# Data Types

There are 8 basic data types in JavaScript. I am not going to cover them one by one here. You can check out [this tutorial](https://javascript.info/types) if you need a refresher on what those types are. 

However, I would like to look at these different data types from a different angle - reference types i.e. objects and value types i.e. primitive types - number, string, etc. A value type holds the data within its own memory allocation. When they are referenced or copied, a new identical value will be created in the \`stack\`, which is a continuous region of memory allocating local context for each executing function. And a reference type contains a pointer or reference to another memory location that holds the real data, which is allocated dynamically from the shared, unstructured pool of memory called \`heap\`.  Because reference types represent the address of the variable rather than the data itself, assigning a reference variable to another doesn't copy the data automatically. Instead it creates a second copy of the reference, which refers to the same location of  \`heap\` as the original value. Finally, the garbage collector frees them from  \`heap\` when no one is referencing them. This is a vital distinction between objects and primitive, non-object types and it will play a key role in the implementation of deep copying. 

## Ways to check data types

I am going to jump to a conclusion directly here: there is not a built-in way to check data types in JavaScript that is straightforward and all-encompassing. All of the current built-in ways in the language are imperfect in its own way, or they are just straight up buggy. Either way, you might have to roll your own solution for simple things like checking data types in JavaScript. This is partly why I don't even get a tiny bit defensive when people are bashing JavaScript and saying it is a poorly designed language. Maybe it is part of tread-offs we have to make for a dynamic typing language? I am not sure.
