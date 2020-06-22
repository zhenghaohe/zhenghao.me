---
path: 'inversion-of-control '
date: 2020-06-22T22:35:56.554Z
title: ' How inversion of control can simplify your React API'
description: >-
  By leveraging the principle of Inversion of control, we can  side-step the
  whole issue of making inadequate assumptions about the future use cases of our
  code.
tag: engineering
---
We often have this kind of conversation happening in our organization: 

1. A dev build a reusable component 
2. People from other teams approach this dev with a new use case that the code doesn’t quite support, but could use a little bit of tweak to achieve that
3. More props and configurable options added to the code for supporting the new use case
4. Repeat steps 2 and 3 a few times
5. It quickly becomes a bit of nightmare to maintain the chuck of code

Not only is it a problem for the dev to maintain the code , but doing this we worsen the user experience as well by shipping more and more code that might be irrelevant to the end user at all as the bundle size grows.

One elegant solution for this type of situation is adopting a pattern called compound components which leverages a really effective mechanism in computer science called **Inversion of Control**

<div class='tip tip-right'>
Here is the link to [Wikipedia's Inversion of control page](https://en.wikipedia.org/wiki/Inversion_of_control)
</div>
