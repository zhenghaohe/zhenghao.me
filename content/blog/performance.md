---
path: performance
date: 2020-12-24T01:07:53.060Z
title: A brain dump of things you can do to optimize the performance of your website
description: >-
  Certainly not a completely exhaustive reference to everything you can do to
  improve your website's performance
tag: engineering
---

<div class='tip tip-left'>
<p>
First thing first: make sure you are measuring the performance in production mode.
</p>
</div>

This is not a completely exhaustive reference to everything you can do to improve your website's performance, nor is it a “how to build a fast website” guide. Performance optimization is such a broad topic and I had these noted down as rough notes on my laptop and decided to convert them into a blog post to bring more clarify to the notes (and my understanding).

## 0. two metrics

1. The First Contentful Paint (FCP) metric measures the time from when the page starts loading to when any part of the page's content is rendered on the screen, i.e. how fast your site can paint pixels to the screen.
2. The First Input Delay (FID) metric measures the time from when a user first interacts with a page (i.e. when they click a link, tap on a button, or use a custom, JavaScript-powered control) to the time when the browser is actually able to begin processing event handlers in response to that interaction.

<div class='tip tip-right'>
<p>
Check out <a href='https://web.dev/vitals/'>Web Vitals</a> to learn about these user-centric metrics 
</p>
</div>

## 1. the loading performance

When one talks about “loading speed”, one typically means networking performance. This is a list of low hanging fruits that you should be thinking about:

1. Use HTTP cache headers to mark cacheable content and set cache durations. The browser will not ask for assets that it believes it already has recent versions of. Cacheing headers can be set in HTTP responses that let the browser know what it should and should not cache.
   - Probably a good idea to tweak `cache-control` per file type.
   - If you don't set `cache-control`, it doesn't mean no cache at all, but means each browser would cache the response differently. This could lead to some unexpected client-side bugs
   - You can even use a `cache-control: immutable` header to make the browser always consider the cache as valid and not send out a verification request to the server (<a href='https://engineering.fb.com/2017/01/26/web/this-browser-tweak-saved-60-of-requests-to-facebook/'>Facebook does this</a>). Use versioning e.g. `contenthash` to force the browser to re-download the cached file if it changes.
2. putting assets on CDNs

   - CDNs are set up to be geographically near the people that are requesting them.
   - Another benefit of using CDNs is that there is no longer a single point of failure. Theses servers also function as an interface between the main server and the end-users.
   - You can use CDNs to cache your static assets. This is how it normally work: the first visitor visits your page, and their browser sends out a request to the CDN, and if the CDN doesn’t have the cache yet, then the request goes to your origin server, and then origin server send back the assets to CDN, and CDN cache it and pass it to the user.
   - You can set a very short `maxage` and very long `s-maxage` in the `cache-control` headers. You can periodically purge the cache in the CDN so that they can get the fresh data even with long `s-maxage`, but you need short `maxage` because you cannot purge the cahce from the user's browser.

3. Bundle JavaScript files and minify them. Most of web apps today use Webpack, minification is one optimization that Webpack performs out of the box for production mode
   - this can reduce the file size and reduce number of times we need to make HTTP requests.
4. Use Code splitting to break very large bundles into smaller chunks.
   - Splitting out vendor packages for third-party code, or any common util files that are shared by many pages, so it can be cached by the browser and only downloaded the first time a user visits a site.
   - A lot of apps often have screens that users would see on very rare occasions - Modals, routes or popups are rarely used. They still take up space in the bundle and increases loading time. With code splitting, we put different parts of app functionality to different files and fetch them only when necessary.
   - You can use the Coverage tab in Chrome DevTools to analyze how much CSS and JS is unused. Code included modals, popups and other components that aren’t rendered right away when the customer opens the page. They are a good candidate to be loaded only when actually needed.
   - However there are a few trade offs you have to make here
     - Your users might end up making more network requests but it shouldn't be a problem with HTTP2.
     - Code splitting requires changes to your application code. It introduces asynchronous logic where previously there was only synchronous logic. It’s not rocket science, but it does add complexity that I think should be justified by a perceivable improvement to the user experience.
5. Use webpack bundle analyzer to review your bundles. you should look for things like 1. large dependencies 2. duplicated dependencies or multiple versions of the same library

<div class='tip tip-left'>
<p>
The amount of factors that need to be taken into consideration when deciding on whether to use Client-side rendering or SSR is not trivial. 
</p>
</div>

6. For client side rendered applications, they do not have all of the user specific data from the beginning so they have to request everything to fill in the blanks. And those requests don’t start happening until the bundle is fully downloaded. You can use server side rendering to inline page data into the HTML, where you calculate the API data on the server side – and include it directly into the HTML response. That leads to reducing the initial page load time. But we still have to wait for the JS files to reach the user before anything can be interactive (hydration).
   - If you content is highly cacheable, you can take advantage of pre-rendered HTML e.g. Gatsby

7) A more radical idea: if we are dealing with a homepage, we might only use React on the server to do server side rendering and use only ship vanilla JavaScript down to the clients. <a href="https://twitter.com/netflixuie/status/923374215041912833?lang=en">Netflix has done this to their landing page</a> and it resulted in a 50% performance improvement

## 2. the rendering performance

Most browser use Just-in-time compilation, that means your app compiles on the clients’ machine. Especially for single page apps, You are sending your user the entire application for them to compile and build.

1. You can cache JS files in the HTTP cache to take advantage of bytecode caching. Most modern browsers do this, the browser would have the bytecode cached so it doesn't pay the cost for compiling it.

<div class='tip tip-left'>
<p>
<a href='https://github.com/facebook/react/blob/43a137d9c13064b530d95ba51138ec1607de2c99/packages/react-scheduler/src/ReactScheduler.js'>The React team</a> is also using postMessage to defer idle work until after the repaint
</p>
</div>

<div class='tip tip-right'>
<p>
Note that a Promise does not queue a task, as it does not exit the current event loop iteration. The scheduling algorithms for Promise is inherently susceptible to starvation, which creates a form of denial of service or deadlock. It is possible for <a href='https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint'>the microtask queue</a> to block your browser just like a infinite while loop.  	 
</p>
</div>

2. Break up your synchronous JavaScript code into separate tasks that can run asynchronously as part of <a href='https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task'>a (macro)task queue</a>. Since JavaScript is single-threaded and when the browser is busy parsing and executing JavaScript code, it cannot run any event listeners at the same time. Here are a couple ways to do queue a task.
   - `window.setTimeout` and `window.setInterval`. However <a href='https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Timeouts_throttled_to_%E2%89%A5_4ms'>browsers throttle timers to ≥ 4ms.</a>
   - the Non-standard `Window.setImmediate()`
   - a lesser-known technique: `MessagePort.postMessage`: Currently the only API that does <a href='https://github.com/YuzuJS/setImmediate#postmessage'>queue a task synchronously</a>
   - There are two more methods to schedule tasks - `requestIdleCallback` and `requestAnimationFrame`. They do not belong to either the macrotask or the microtask. I might write another blog post to talk about these different broswer scheduling APIs.
3. code-splitting unused functionality, you not only reduce bundle init time, but also decrease the compilation time. The less JS code there is, the faster it compiles.

4) You should use `defer` or `async` script attributes so that browser know that scripts can be downloaded in the background, without interrupting the document parsing. This can reduce the page loading time.

<div class='tip tip-right'>
<p>
But probably should just use the defer attribute and put the script tags in the head tag <a href='https://flaviocopes.com/javascript-async-defer/#blocking-parsing'> according to this blog post</a>
</p>
</div>

5. Find ways to minimize the number of reflows and repaints the browser has to do when running your app.

   - When changing classes for stylings, try to change them at the lowest levels of the DOM tree.
   - Batch DOM manipulations - If you are using frameworks, you are effectively getting for free. For example, In React most of your state updates are batched automatically (except for asynchronous updates, that are running much later in a totally separate event loop call stack). It would write changes to Virtual DOM and does a diffing between the old and new Virtual DOM and make sure the only minimum required changes are done in the real DOM.
   - Split CPU-hungry tasks into multiple macrotasks(not microtasks which would still block rendering) using zero delayed `setTimeout`. Here is a great <a href='https://javascript.info/event-loop'>tutorial</a> on that you can check out.

<div class='tip tip-left'>
<p>
          React has been doing event delegation automatically since its first release. It attaches one handler per event type directly at the document node.  React 17 no longer attaches event handlers at the document level. Instead, it attaches them to the root DOM container into which React tree is rendered.
</p>
</div>
6. Review the number of event handlers you have on your site from time to time. Make sure you are using event capturing/bubbling to save memory (with React you are effectively getting for free). Also clean up the event handlers when an element is removed from the DOM to prevent memory leaks.

7. Debounce various events
   - window resize events
   - user typing events
   - any other slow synchronous operation such as reading/writing to `localStorage`
8. If you can using React, you can opt out of the default rendering behavior - rendering a component will, by default, cause all components inside of it to be rendered too, by using `React.memo`, or `React.pureComponent` to skip rendering a component. This means React will also skip rendering that entire subtree, because it's effectively putting a stop sign up to halt the default "render children recursively" behavior.

## 3. Misc.

1. Choose an appropriate format for images and compress them. - You can use `<picture>` tag for `webp` with a `jpg` fallback. Because `webp` is not supported by Safari.
2. Preload things that you think will also be needed in a short time.
3. Deduplicate network requests you make. - <a href='https://react-query.tanstack.com/'>React Query</a> makes this really easy.

<div class='tip tip-left'>
<p>
   "synchronous", in practice, means blocking. Check out <a href='https://twitter.com/acdlite/status/1344398786894966784'>this tweet</a> for more nuances about this word "synchronous"
</p>
</div>

4. Don't put too much stuff in your `localStorage`. <a href='https://www.janbambas.cz/new-faster-localstorage-in-firefox-21/'>Firefox does this</a>: they read the entire store into memory on page navigation, meaning that the more you stuff in LocalStorage, the more you impact page load time as well as memory costs.
   - `localStorage` is a synchronous API, you may wish to throttle or debounce the updates to localStorage. Because. it can cause performance problems if read/updated too rapidly.
     - There is one edge case to think about when debouncing writing to `localStorage`, that is if the user navigate away from the page before the debounced writing fires, the write would likely fail.

5) Offload computationally intensive tasks to Service workers or Web workers.
   - It comes with <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Transferring_data_to_and_from_workers_further_details'>the cost of serialization</a>
6) You can mess around `window.navigator` to get to know the amount of memory the user's device has or <a href='https://twitter.com/umaar/status/897753290510913536'>their bandwidth</a> so you can decide whether to download some resources at all.
