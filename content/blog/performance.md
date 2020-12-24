---
path: A brain dump of things you can do to optimize the performance of your website
date: 2020-12-24T01:07:53.060Z
title: performance
description: >-
  Certainly not a completely exhaustive reference to everything you can do to
  improve your website's performance. Just trying to convert these pieces into a
  blog post to bring more clarify to the notes (and my understanding). 
tag: engineering
---
This is not a completely exhaustive reference to everything you can do to improve your website's performance, nor is it a “how to build a fast website” guide. Performance optimization is such a broad topic and I had these noted down as rough notes on my laptop and decided to convert them into a blog post to bring more clarify to the notes (and my understanding). 

First thing first, make sure you are measuring the performance in production mode.

## the loading performance

When one talks about “loading speed”, one typically means networking performance. This is a list of low hanging fruits that you should be thinking about:

1. Use HTTP cache headers to mark cacheable content and set cache durations. The browser will not ask for assets that it believes it already has recent versions of. Cacheing headers can be set in HTTP responses that let the browser know what it should and should not cache.
   * If you don't set the Cache-control , it doesn't mean no cache at all, but means each browser would cache the response differently. This could lead to some unexpected client-side bugs 
2. putting assets on CDNs 
   * CDNs are set up to be geographically near the people that are requesting them.
   * Another benefit of using CDNs is that there is no longer a single point of failure. Theses servers also function as an interface between the main server and the end-users. 
   * You can use CDNs to cache your static assets. The first visitor visits your page. Their browser sends out a request to the CDN, and if the CDN doesn’t have the cache yet. The request goes to your origin server. And origin server send back the assets to CDN, and CDN cache it and pass it to the user.
     * You can use s-maxage in the cache control headers to periodically purge the cache in the CDN so after that they can get the fresh data.

3. Bundle JavaScript files and minifies them. Most of web apps today use Webpack, minification is one optimization that Webpack performs out of the box for production mode
   * this can reduce the file size and reduce number of times we need to make HTTP requests.
4. Use Code splitting to break very large bundles into smaller chunks. 
   * Splitting out vendor packages for third-party code so it can be cached by the browser and only downloaded the first time a user visits a site.
   * A lot of apps often have screens that users would see on very rare occasions - Modals, routes or popups are rarely used. They still take up space in the bundle and increases loading time. With code splitting, we put different parts of app functionality to different files and fetch them only when necessary.
   * You can use the Coverage tab in Chrome DevTools to analyze how much CSS and JS is unused. Code included modals, popups and other components that aren’t rendered straight when the customer opens the page. They are a good candidate to be loaded only when actually needed.
   * However there are a few trade offs you have to make here
     * Your users might end up making more network requests but it shouldn't be a problem with HTTP2.
     * Code splitting requires changes to your application code. It introduces asynchronous logic where previously there was only synchronous logic. It’s not rocket science, but it does add  complexity that I think should be justified by a perceivable improvement to the user experience.
5. Use webpack bundle analyzer to review your bundles. you should look for things like 1. large dependencies 2. duplicated dependencies or multiple versions of the same library
6. For client side rendered applications, they do not have all of the user specific data from the beginning so they have to request everything to fill in the blanks. And those requests don’t start happening until the bundle is fully downloaded. You can use server side rendering to inline page data into the HTML, where you calculate the API data on the server side – and include it directly into the HTML response. That leads to reducing the initial page load time. But we still have to wait for the JS files to reach the user before anything can be interactive(hydration).

##  the rendering performance 

Most browser use Just-in-time compilation, that means your app compiles on the clients’ machine. Especially for single page apps, You are sending your user the entire application for them to compile and build.

1. code-splitting unused functionality, you not only reduce bundle init time, but also decrease the compilation time. The less JS code there is, the faster it compiles.
2. You can cache JS files in the HTTP cache to take advantage of bytecode caching. Most modern browsers do this, the browser would have the bytecode cached so it doesn't pay the cost for compiling it. 
3. You should use defer or async script attributes so that browser know that scripts can be downloaded in the background, without interrupting the document parsing. This can reduce the page loading time.
4. Find ways to minimize the number of reflows and repaints the browser has to do when running your app. 
   * When changing classes for stylings, try to change them at the lowest levels of the DOM tree.
   * batch DOM manipulations - If you are using frameworks, you are effectively getting for free. For example, In React most of your state updates are batched automatically (except for asynchronous updates, that are running much later in a totally separate event loop call stack). It would write changes to Virtual DOM and does a diffing between the old and new Virtual DOM and make sure the only minimum required changes are done in the real DOM. 
5. Debounce various events 
   * window resize events
   * user typing events

## Misc.

1. Choose an appropriate format for images and compress them. - You can use <picture> tag for webp with a jpg fallback. Because webp is not supported by Safari. 
2. Preload things that you think will also be needed in a short time. For example, Google starts preloading the first link in search results as soon as you do a search
3. Deduplicate network requests you make
4. don't put too much stuff in your localStorage. Firefox does this: they read the entire store into memory on page navigation, meaning that the more you stuff in LocalStorage, the more you impact page load time as well as memory costs. https://www.janbambas.cz/new-faster-localstorage-in-firefox-21/
   * localStorage is a synchronous API, you may wish to throttle or debounce the updates to localStorage. Because. it can cause performance problems if it’s read/updated too rapidly.
