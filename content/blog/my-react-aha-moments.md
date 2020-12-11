---
path: react-aha
date: 2020-12-07T04:50:28.506Z
title: My React "AHA" Moments
description: >-
  This post is a growing collection of things that triggered so called “aha”
  moments, throughout my journey of learning React.
tag: engineering
---

# This post is a growing collection of things that triggered so called “aha” moments throughout my journey of learning React.

<div class='tip tip-right'><p>An <a href="https://en.wikipedia.org/wiki/Eureka_effect"> “aha” moment</a> is a moment of sudden insight or clarity; when the subject matter suddenly makes sense. </p></div>

## 1. Why is that whenever we use React, we need to import two separate packages i.e. "react" and "react-dom"?

To understand the distinction here, first we need to understand that, reconciliation and rendering are two **separate** phases for a React app. Reconciliation is the algorithm behind what is popularly understood as the “virtual DOM.”. In other words, it is the algorithm React uses to diff one tree with another to determine which parts need to be changed. On the other hand, Rendering is the process where React uses that information to actually update the app.

There are more than just one rendering environments - for example, in the case of a browser application, those virtual DOMs end up being translated to a set of DOM operations. The other major rendering environment is native iOS and Android views via React Native. This separation means that React DOM and React Native can use their own renderers while sharing the same reconciler, provided by React core. That also means the reconciler is principally not concerned with the renderer (though renderers might need to change to support and take advantage of the reconciler).

## 2. Why is that immutability is so important when it comes to state updates in React app?

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

## 3. Why is that state updates in React may Be asynchronous

<div class='tip tip-right'><p>It comes from the official docs<a href="https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous"> "State Updates May Be Asynchronous"</a></p></div>

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
