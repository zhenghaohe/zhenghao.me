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

## Why is that whenever we use React, we need to import two separate packages i.e. "react" and "react-dom"?

To understand the distinction here, first we need to understand that, reconciliation and rendering are two **separate** phases for a React app. Reconciliation is the algorithm behind what is popularly understood as the “virtual DOM.”. In other words, it is the algorithm React uses to diff one tree with another to determine which parts need to be changed. On the other hand, Rendering is the process where React uses that information to actually update the app. There are more than just one rendering environments - for example, in the case of a browser application, those virtual DOMs end up being translated to a set of DOM operations. The other major rendering environment is native iOS and Android views via React Native. This separation means that React DOM and React Native can use their own renderers while sharing the same reconciler, provided by React core. That also means the reconciler is principally not concerned with the renderer (though renderers might need to change to support and take advantage of the reconciler).

## Why is that immutability is so important when it comes to state updates in React app?

<div class='tip tip-left'><p>
Actually instead of using "===", React uses "Object.is". But they are really just the same except for two cases: "NaN" and "0" vs. "-0"</p></div>

State updates in React should always be done immutably, which is really no strangers to most of the React devs out there. But what are the reasons exactly for having immutability when updating states in React? The common answer you can find on the Internet is that mutation causes confusion about when and why data actually got updated, or where a change came from. But recently I just realized that there is another, arguably more important reason for not mutating state is that, React relies on shallow quality checks to compare the current props and previous props to avoid unnecessary re-renders when you opted in some optimization with either `React.memo`, `PureComponent` , `shouldComponentUpdate` etc. So React determines whether a prop is a new value by doing something conceptually similar to `Object.keys(prevProps).some(key => prevProps[key] !== nextProps[key])` if you mutate, then the properties in the `props` stay the same referentially, which results in React assuming those components didn’t change at all. Therefore, it can result in components not rendering when you expected they would render.

<div class='tip tip-left'><p>React might batch updates so that multiple state updates result in a single render pass being queued and executed, usually on a slight delay. </p></div>

<div class='tip tip-right'><p>To be more precise here, mutating the state will not always make the component not re-rendering when it should be. A component can be re-rendering for a variety of reasons.  React will bail out of the render pass completely only when the state has been mutated and there happens to be no other reasons to continue rendering (such as the parent having rendered). </p></div>

Also, even if you are not using either of these optimization techniques, you would likely still run into bugs if you are mutating the state. With `useState` and `useReducer` hook, every time you call the updater or the dispatch, React will queue up a re-render. However, React requires that any hook state updates must pass in / return a new reference as the new state value, whether it be a new object/array reference, or a new primitive (string/number/etc). React applies all state updates during the render phase. When React tries to apply a state update from a hook, it checks to see if the new value is the same reference. \*if\* the value is the same reference as before, React might just throw away the render results for the component and bail out of the render pass completely.

The bottom line is, React, and the rest of the React ecosystem, assume immutable updates. Any time you mutate, you run the risk of bugs.
