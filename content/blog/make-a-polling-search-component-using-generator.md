---
path: generator-search
date: 2020-12-20T03:10:29.859Z
title: Make a polling search component using generator functions
description: A polling search component seems to be a legit use case for generator functions.
tag: engineering
---

## Intro

Generator is probably the most underused JavaScript feature. Despite its unpopularity, it has been around since ES6 and until this day it has over 96% browser support.

<div class='tip tip-right'><p>I learned about the number "96%" from <a href="https://www.youtube.com/watch?v=cLxNdLK--yI"> this video </a> </p></div>

People do not use generator functions often partly because the legit use cases for generators are indeed rare. If you are not a library author you probably wouldn't need to use generators for normal business requirements. But it might also be because generators are hard to understand. For one thing, they are your average functions that follow something called run-to-completion modal, which basically means that the function cannot be stopped before it finishes the last line, and the only way to exit is by returning from it or throwing an error. And if you call that function again, it will begin the execution from the top again.

In contrast, a generator is a function that can stop midway and then continue from where it stopped. Inside of a generator function, we can use the keyword `yield` to pass results to the outside, as well as entering values for the next iteration. It acts as a doorway so that we can control the output midway through. This feature makes generator functions a great candidate for doing tasks such as producing a sequence of results or being an observer that keeps observing for values and acts when it gets one.

<div class='tip tip-right'><p>You can read more about Generator functions <a href="https://exploringjs.com/es6/ch_generators.html#sec_generators-as-observers"> here</a> </p></div>

## Generators for Infinite Data Streams

Imagine we want to implement a polling search component, which talks to a back end that reacts to a specific search query and then returns results that match with the query as the response. The number of results can potentially be huge. Therefore we might not get an exhaustive list of results back immediately. Instead, we would get a batch of results back along with a token that indicates the next batch to fetch. We are fetching results in batches because we want to show them to the user as soon as possible so that they have something to work with immediately.

To me, this sounds like a good use case for generators: we are constantly polling the back end for more, but only end the function if the back end tells us it's done.

<div class='tip tip-right'><p>Here I am using cursor-based pagination as the example, as opposed to offset based pagination. You can check out this <a href="https://slack.engineering/evolving-api-pagination-at-slack/#:~:text=Cursor%2Dbased%20pagination%20works%20by,specific%20item%20in%20the%20dataset.&text=This%20method%20addresses%20the%20drawbacks,columns)%20in%20the%20source%20table."> blog post to learn their differences</a> </p></div>

Let's first define the contracts between the client and the server by explicitly defining the type for what we would get back as the response of the querying.

```ts
type PollingResults = {
  results: Results[]
  done: boolean
  nextToken?: string
}
```

And we have a function called `polling` that takes two arguments: `query` and `nextToken` where `query` is the user input and `nextToken` is an optional string provided by the response of the previous iteration of polling.

As discussed before, our generator function would stop if the back end says there are no more results to fetch, which is communicated via the `done` boolean, or even better, we can some constraints on the front end to preemptively stop polling if, let's say, we reach a certain amount of results we want to render on the UI.

Therefore, we can write such a generator function as following:

```js
async function* getResults(query) {
  let state, isMax, nextToken, canContinue
  do {
    state = await polling({ query, nextToken })
    ;[isMax, nextToken] = yield {
      results: state.results,
      nextToken: state.nextToken,
    }
    canContinue = !isMax && !state.done
  } while (canContinue)
}
```

I know that this piece of syntax looks kind of funky.

```js
 [isMax, nextToken] = yield {
      results: state.results,
      nextToken: state.nextToken
    };
```

As I said, `yield` opens up a door that can not only return a value to the outside but also accept a value from the outside. Here we are yielding the results along with `nextToken` as the output, and also we put what gets passed into the generator into a tuple, i.e. `isMax` and `nextToken`, where `isMax` indicates the UI has reached the limit of showing the results, and `nextToken` is from the previous iteration that we can use to fetch the next batch of results.

And then we invoke the generator function inside of an event handler function.

```js
async function handleChange(event) {
  const value = event.target.value
  const resultsGen = getResults(value)
  let next,
    count = 0,
    nextToken
  do {
    const isMax = count >= 30 // We will stop polling if the number of results we got exceed 30
    next = await resultsGen.next([isMax, nextToken])
    if (typeof next.value !== "undefined") {
      next.value.results.map(append)
      count += next.value.results.length
      nextToken = next.value.nextToken
    }
  } while (!next.done)
}
```

One thing to note that, not to confuse `next.done` in the event handler function with `state.done` in the generator function. The former is returned by the generator function after it hit an implicitly `return` statement so it returns (instead of yielding) an object `{ value: undefined, done: true}`. The latter is returned by the response from the back end API.

With the generator function implemented, we can append the results on the go with

```js
function append(result) {
  const node = document.createElement("li")
  node.innerHTML = `<a href="${result.href}">${result.title}</a>`
  document.querySelector("#results")?.append(node)
}
```

Here is the demo you can play with. Excuse the absence of stylings, I suck at this part of web development

<iframe src="https://codesandbox.io/embed/vigorous-smoke-dufzk?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vigorous-smoke-dufzk"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Bonus

I have been grinding Leetcode these days to prepare myself for the upcoming interviews. <a href='https://leetcode.com/problems/flatten-nested-list-iterator/'>Here is one question</a> that lends itself pretty well to Generators.

The question asks you to implement an iterator to flatten a potentially nested array of integers. The iterator needs to have two methods: 1. `next` to return the next integer in the flattened array; 2. `hasNext` to return a `boolean` that indicates whether or not we are at the end of teh array.

Here is my attempt using Generators. (I did a few modifications just to make the example run locally)

```js
function isInteger(num) {
  return typeof num === "number" && Number.isInteger(num)
}
class NestedIterator {
  constructor(nestedList) {
    this.gen = this.listGenerator(nestedList)
    this.nextVal = this.gen.next()
  }

  hasNext() {
    return !this.nextVal.done
  }

  next() {
    const val = this.nextVal.value
    this.nextVal = this.gen.next()
    return val
  }

  *listGenerator(list) {
    for (const el of list) {
      if (isInteger(el)) yield el
      else yield* this.listGenerator(el)
    }
  }
}

const iterator = new NestedIterator([1, [2, 3], 4, [5, [6]]])

while (iterator.hasNext()) {
  console.log(iterator.next()) // 1, 2, 3, 4, 5, 6
}
```

The alternative is to use a plain array to hold the flattened array:

```js
class NestedIterator {
  constructor(nestedList) {
    this.arr = []
    flatten(this.arr, nestedList)
  }

  hasNext() {
    return this.arr.length > 0
  }
  next() {
    return this.arr.shift()
  }
}
```

In my opinion, the first approach with Generators is better than second approach. For one thing, Generators give us the ability to performe lazy evaluation. As a result, it is more memory efficient. We generate only the values that are needed. With normal functions, we needed to pre-generate all the values, in this case pre-flattening the whole array and keep them around in case we use them later. However, with Generators, we can defer the computation till we need it.

<div class='tip tip-right'><p>Lazy evaluation is an evaluation model which delays the evaluation of an expression until its value is needed. That is, if we don’t need the value, it won’t exist. It is calculated as we demand it.
</p></div>
