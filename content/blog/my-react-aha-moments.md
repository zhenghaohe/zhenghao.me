---
path: react-aha
date: 2020-12-07T04:50:28.506Z
title: My React "AHA" Moments
description: >-
  This post is a growing collection of things that triggered so called “aha”
  moments, throughout my journey of learning React.
tag: engineering
---

This post is a growing collection of things that triggered so called “aha” moments throughout my journey of learning React.

<div class='tip tip-right'><p>An <a href="https://en.wikipedia.org/wiki/Eureka_effect"> “aha” moment</a> is a moment of sudden insight or clarity; when the subject matter suddenly makes sense. </p></div>

## 1. Why do we need virtual DOM?

I wanted to start this blog post with one of my recent realizations - why do we need virtual DOM in React exactly? I do not want to reiterate that superficial kind of claim that you read about online all the time, which is that many people believe frameworks(or libraries) like React or Vue utilize virtual DOMs because they are fast. Stating that React’s DOM manipulation is faster than the DOM manipulation done using DOM APIs calls is just not true since eventually React also uses the DOM APIs to update the DOM.

First of all, what is Virtual DOM? Here is a snippet I found somewhere online that I think is doing a good job of explaining it.
<br />

> A virtual DOM is an in-memory object maintained as a copy of the DOM tree. For Virtual DOM-based frameworks (like React or Vue), we render our UI changes to the virtual DOM (and not directly to the DOM). The framework then syncs the virtual DOM with the real DOM. The real DOM changes are then picked by the browser for repainting.
> <br />

<div class='tip tip-left'>
<p>
One of the original slaes pitches for React back to 2013 was <a href="https://www.slideshare.net/floydophone/react-preso-v2">  "act like we're redrawing the entire app on every update".</a>
</p>
</div>
Then why do we need Virtual DOM exactly? To answer this question we need to take a look at the approach React takes to detect changes in the data modal and render them on the view. Now pretend we don’t have React or any other JavaScript frameworks or libraries whatever you want to call them, how would you go about updating the DOM when your data modal changes? From a performance standpoint, you would want to only update the DOM node(s) that actually gets affected by the change in the data. To achieve that, you have to be aware of all the places that are affected by this change and manually alter parts of the DOM by hand. This approach works but it is absolutely not going to scale when you have a large and complex application, as the amount of cognitive overhead of tracking and maintaining state changes by hand is going to explode. Another potential approach we can take is that we rebuild the entire DOM from scratch for any changes. This approach removes these pain points mentioned earlier, but obviously, you lose all the performance gains. And this is where Virtual DOM comes in - we add an extra layer of a separate “copy” of the real DOM tree, i.e. Virtual DOM which consists of plain JavaScript objects in memory and we re-render the entire Virtual DOM instead. After that, we do a diff between the new Virtual DOM tree and the old Virtual DOM tree and collect a list of all the necessary, minimum required changes that need to be applied to make the real DOM look like the current desired output together in a single reflow. This way we get the best of both worlds - we get that optimized and performant DOM updating, but as developers, we don’t have to keep a mental model of the entire application and remember what you need to change for any given state transition.

A huge part of the performance problems we face with the web today come from browser repaints. It takes a lot of work for the browser to complete multiple repaint cycles caused by updates in the DOM tree. And that is what directly causes unresponsive pages and janky experiences. Instead of updating whatever needs to be updated to the DOM tree, React makes use of Virtual DOM and applies a process known as `diffing` or `reconciliation`, which basically means it compares the new Virtual DOM with the previous snapshot and then figures out what changes are necessary and apply them to the real DOM. Only by adding this extra layer of a separate "copy" of the real DOM tree, React can control when and what changes are passed on to the DOM for rendering then it can have a chance to optimize for minimizing repaints.

<div class='tip tip-right'>
<p>
A while back, the React team introduced something called Fiber which allows the update to be broken into smaller chunks and assign different priorities to them. This means that updates don't block the main thread for long periods of time, though it doesn't reduce the total amount of work or the time an update takes.
</p>
</div>

And here we came to a natural conclusion: Virtual DOM is not a feature. It's a means to an end, the end being able to allow developers to write declarative, state-driven UI development. But this does add overhead because, as I have mentioned many times, you can't apply changes to the real DOM without first comparing the new virtual DOM with the previous snapshot.

One interesting thing to think about is that DOM objects should literally just be JavaScript Objects. The fact that they are separate things(DOM objects are actually C++ according to <a href='https://v8.dev/blog/tracing-js-dom'>this blog post</a>) is mostly because of some historical reasons. There is no reason why creating a DOM object should be any more expensive than creating a JavaScript object. Having duplicate JavaScript objects to represent the DOMs and also DOM objects in memory cannot be a good thing. That is why I think Svelt looks pretty promising. Unlike React or Vue, Svelte is a compiler that knows at build time how things could change in your app, rather than waiting to do the work at run time, so there is no for Virtual DOMs and diffing at all.

## 2. Why is that whenever we use React, we need to import two separate packages i.e. "react" and "react-dom"?

To understand the distinction here, first we need to understand that, reconciliation (frequently referred to as "the render phase") and commit are two **separate** phases for a React app. Reconciliation is the algorithm behind what is popularly understood as the “virtual DOM.”. In other words, it is the algorithm React uses to diff one tree with another to determine which parts need to be changed. On the other hand, "commit" is the process where React uses that information to actually update the app.

There are more than just one rendering environments - for example, in the case of a browser application, those virtual DOMs end up being translated to a set of DOM operations. The other major rendering environment is native iOS and Android views via React Native. This separation means that React DOM and React Native can use their own renderers while sharing the same reconciler, provided by React core. That also means the reconciler is principally not concerned with the renderer (though renderers might need to change to support and take advantage of the reconciler).

## 3. Why is that immutability is so important when it comes to state updates in React app?

<div class='tip tip-left'><p>
Actually instead of using "===", React uses "Object.is". But they are really just the same except for two cases: "NaN" and "0" vs. "-0"</p></div>

State updates in React should always be done immutably, which is really no strangers to most of the React devs out there. But what are the reasons exactly for having immutability when updating states in React? The common answer you can find on the Internet is that mutation causes confusion about when and why data actually got updated, or where a change came from. But recently I just realized that there is another, arguably more important reason for not mutating state is that, React relies on shallow quality checks to compare the current props and previous props to avoid unnecessary re-renders when you opted in some optimization with either `React.memo`, `PureComponent` , `shouldComponentUpdate` etc. So React determines whether a prop is a new value by doing something conceptually similar to `Object.keys(prevProps).some(key => prevProps[key] !== nextProps[key])` if you mutate, then the properties in the `props` stay the same referentially, which results in React assuming those components didn’t change at all. Therefore, it can result in components not rendering when you expected they would render.

<div class='tip tip-left'><p>React might batch updates so that multiple state updates result in a single render pass being queued and executed, usually on a slight delay. </p></div>

<div class='tip tip-right'><p>To be more precise here, mutating the state will not always make the component not re-rendering when it should be. A component can be re-rendering for a variety of reasons.  React will bail out of the render pass completely only when the state has been mutated and there happens to be no other reasons to continue rendering (such as the parent having rendered). </p></div>

Also, even if you are not using either of these optimization techniques, you would likely still run into bugs if you are mutating the state. With `useState` and `useReducer` hook, every time you call the updater or the dispatch, React will queue up a re-render. However, React requires that any hook state updates must pass in / return a new reference as the new state value, whether it be a new object reference, or a new primitive (string/number/etc). React applies all state updates during the render phase. When React tries to apply a state update from a hook, it checks to see if the new value is the same reference. _if_ the value is the same reference as before, React might just throw away the render results for the component and bail out of the render pass completely.

The bottom line is, React, and the rest of the React ecosystem, assume immutable updates. Any time you mutate, you run the risk of bugs.

<div class='tip tip-left'>
<p>
Over the years people have been questioning this default behaviour of React. Dan Abramov has repeatedly pointed out that we should not ignore the cost of comparing props. See<a href="https://twitter.com/dan_abramov/status/1095661142477811717">  this twitter thread</a> from Dan
</p>
</div>

A following up question would be that, why is that React only does shallow comparison instead of deep comparison? One simple answer is because shallow comparison is relatively cheap with a time complexity of O(n). However even with linear time complexity, shallow comparison is not free. This is also why in normal rendering, **React does not care whether "props changed"** - it will render child components unconditionally just because the parent rendered. Instead of diffing the input (props), React, by default, diffs the output (virtual DOMs).

## 4. Why is that state updates in React may Be asynchronous?

<div class='tip tip-right'><p>It comes from the official docs<a href="https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous"> "State Updates May be Asynchronous"</a></p></div>

Anyone who has worked with React professionally would know that state updates in React are async, we should not rely on their values for calculating the next state. But how exactly are they asynchronous? Do they return a promise so you can put `await` in front of it? More importantly, why does React default to asynchronicity when it comes to state updates rather than synchronously updating them?

By default, React applies this kind of optimization automatically, in the form of _render batching_. That is, when multiple calls to `setState()` result in a single render pass being queued and executed, usually on a slight delay. Currently React automatically batches state updates that _only_ occur in its own event handlers i.e. `on *[EventName]` . It does so by wrapping them in an internal function called `unstable_batchedUpdates`. React tracks all state updates that are queued while `unstable_batchedUpdates` is running, and then applies them in a single render pass afterwards.

However, React cannot batch state updates in promises, because React has no control over when they are resolved, same thing with native event handlers, `setTimeout`, `setInterval`, and `requestAnimationFrame`, all of which are running much later in a totally _separate event loop call stack_

<div class='tip tip-right'>
<p>
In React’s upcoming Concurrent Mode, React will always batch updates, all the time, everywhere.
</p>
</div>

Then the question becomes, why does React do that?

We need to realize that React is not a generic data processing library. It is a library for building user interfaces. In terms of the UI, it’s not necessary for every update to be applied immediately; in fact, doing so can be wasteful, causing frames to drop and degrading the user experience.

Lastly, this is an interesting demo you can play with to get a better understanding of React's state updates batching. I did not create this demo. It was created by <a href='https://twitter.com/yagopereiraaz'>Yago</a>.

<iframe src="https://codesandbox.io/embed/react-dom-batched-updates-forked-05uqd?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react-dom-batched-updates (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 5. Why is that we need to perform side effects in useEffect / useLayoutEffect Hooks, rather than in the render logic?

It has been stated upfront in the official docs of `useEffect` Hook that it is a place where we can perform side effects. I guess there are many people like me, who have critically thought about the downsides of _not_ putting your side effects in `useEffect` / `useLayoutEffect` Hooks. The conclusion I gathered before was that because a lot of times the side effects we wanted to perform take time. One of the most common side effects we need to deal with is data fetching. You know, we've all written stuff like that, where you fire off a promise in `useEffect` and you keep track of the data, the error, and the status. Actually, I would even go as far as to say you probably should not use `useEffect` just for data fetching, at least not for any serious projects. It is a building block that is too low-level and it should have been encapsulated in some more sophisticated data fetching libraries such as React Query or any other custom hooks. (This is loosely based on <a href='https://overreacted.io/a-complete-guide-to-useeffect/'>a blog post</a> from Dan Abramov when Hooks just got released)

<div class='tip tip-right'>
<p>
In the longer term, Suspense will gradually covers most of data fetching use cases to further reduce the needs of using useEffect, according to <a href='https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-16x-mid-2019-the-one-with-suspense-for-data-fetching'>this React roadmap</a>  
</p>
</div>

Now back to the topic - it should be obvious that asynchronous tasks like data fetching should not block browser painting. Therefore by putting them inside of `useEffect`, we deliver a better user experience. However, this is just part of the picture. There is another important aspect about making sure our render function is side-effect free, that is it prepares us for React's upcoming new feature - Concurrent Mode.

Side effects by nature lead to the non-deterministic output. And it is vital to make the rendering phase deterministic during Concurrent Mode since the way Concurrent Mode works is to break the rendering work into pieces, pausing and resuming the work to avoid blocking the browser. That means, React might end up rendering a component multiple times, but throw away the render output because other updates invalidate the current work being done, either because of an error or a higher priority interruption. You can see how having effect sides in the rendering phase can be problematic during the concurrent mode.

Here's a simple example showing these differences (because the world can never have too many "counter" examples):

```js
const BadCounter = () => {
  const countRef = useRef(0)
  countRef.current += 1
  return <div>count:{countRef.current}</div>
}
```

<div class='tip tip-left'>
<p>
ref is essentially a global variable outside the function scope, hence modifying it is a side effect.
</p>
</div>

This works as expected in _traditional_ React where the render phase and the commit phase is one-to-one. That is, whenever the parent component re-renders, the counter will increase by 1. However, in Concurrent Mode, if React invokes the render function multiple times without committing, the counter will increase unexpectedly.

```js
const GoodCounter = () => {
  const countRef = useRef(0)
  let currentCount = countRef.current
  useEffect(() => {
    countRef.current = currentCount
  })
  currentCount += 1
  return <div>count:{currentCount}</div>
}
```

The above version uses `useEffect` to perform the side effect, which only runs once after the commit phase. `currentCount` is a local variable within the render function scope, so it will only change the ref count in the commit phase.

As I pointed out earlier, the subtle bug in `BadCounter` example is not necessarily going to manifest in _traditional_ React where the render phase and the commit phase is one-to-one. _Unless_ we intentionally double-invoke the render function, and that is where React's Strict mode comes in handy - it helps you spot these side effects by double-rendering components inside of a `<StrictMode>` tag in development.

By the way, why does React need Concurrent Mode? Here I would like to really drill home the idea that "rendering" is not the same thing as "updating the DOM", as they are two separate processes in React. The commit phase is usually very fast, but rendering can be slow. It makes sense for React to pause the work in the rendering phase to allow the browser to process events. React will either resume, throw away, or recalculate that work later as appropriate. Also, different types of updates have different priorities — an animation update from user interactions needs to complete more quickly than less important background work such as rendering data fetched from the network. This is actually a running theme in React design - to assign priorities to different types of updates.
