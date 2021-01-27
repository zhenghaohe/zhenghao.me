---
path: js-in-depth1
date: 2021-01-27T00:41:09.507Z
title: "JS in Depth: Types, Objects and Deep Copy"
description: >-
  This is the first part of a series I'm calling JS in Depth, where I try to
  focus on a selection of important and what I consider to be in-depth knowledge
  about JavaScript.
tag: engineering
---

This is the first part of a series I'm calling JS in Depth, where I try to focus on a selection of important and what I consider to be in-depth knowledge about JavaScript. I am well aware of the fact that there is no shortage of good materials on JavaScript fundamentals and I have no interest in repeating them, nor will I cover every little aspect of the languages in this series. Therefore, this is not going to be a tutorial for people who just started or have little experience with JavaScript, although I will try to link references for the terms or techniques mentioned in the article and I encourage you to search for definitions yourself.

In this blog post I am going to cover data types in JavaScript, especially objects, and ways to tell which type is stored in a variable and lastly I will put these concepts together by writing out a deep copy util function by hand without using any 3rd party libraries. There are tons of tutorials with deep copy implementations out there on internet but the one that I am presenting in this blog post _hopefully_ could be one of the best solutions you can find online.

# Data Types

There are 8 basic data types in JavaScript. I am not going to cover them one by one here. You can check out [this tutorial](https://javascript.info/types) if you need a refresher on what those types are.

<div class='tip tip-left'><p>Check out <a href='https://chromium.googlesource.com/v8/v8/+/4.4-lkgr/src/objects.h'>this source code snippet of V8</a> if you are interested in seeing an exhaustive list of things on the heap in JavaScript.</p></div>

However, I would like to look at these different data types from a different angle - reference types i.e. objects and value types i.e. primitive types - number, string, etc. A value type holds the data within its own memory allocation. When they are referenced or copied, a new identical value will be created in `stack`, which is a continuous region of memory allocating local context for each executing function. And a reference type contains a pointer or reference to another memory location that holds the real data, which is allocated dynamically from the shared, unstructured pool of memory called `heap`. Because reference types represent the address of the variable rather than the data itself, assigning a reference variable to another doesn't copy the data automatically. Instead it creates a second copy of the reference, which refers to the same location of `heap` as the original value. Finally, the garbage collector frees them from `heap` when no one is referencing them. This is a vital distinction between objects and primitive, non-object types and it will play a key role in the implementation of deep copying.

## Ways to check data types

I am going to jump to a conclusion directly here: there is not a built-in way to check data types in JavaScript that is straightforward and all-encompassing. All of the current built-in ways in the language are imperfect in its own way, or they are just straight up buggy. Either way, you might have to roll your own solution for simple things like checking data types in JavaScript. This is partly why I don't even get a tiny bit defensive when people are bashing JavaScript and saying it is a poorly designed language. Maybe it is part of tread-offs we have to make for a dynamic typing language? I am not sure.

### the `typeof` operator

First of all just a little fun fact: the typeof operator is the only operator in existence of the language that is able to reference a thing that doesn't exist and not throw an error. You can get away with something like this.

```js
typeof randomeVariableIDidNotDeclare // doesn't even throw an error
```

So you can use the `typeof` operator to check the data types and it works fine for `number`, `string`, `undefined`, `boolean`, `symbol`, `function` but there are some pitfalls to watch out for when using `typeof` :

- It is known bug that typeof null === 'object'. “The history of typeof null” describes this bug in details.
- It doesn't differentiate between different reference types except for functions.

```js
typeof [] // 'object'
typeof {} // 'object'
typeof new Date() // 'object'
typeof /w/ // 'object'
```

### the `instanceof` operator

`instanceof` checks the constructor of an object. In other words, it tests which class created a given value.

```js
let Car = function() {}
let benz = new Car()
benz instanceof Car // true

const array = [1, 2]
array instanceof Array // true
```

`instaceof` operator can correctly determine types for objects, but not for primitive types.

As you can see, neither is perfect and most of the time people have to leverage and combine both approaches to do type checking.

### the `Object.prototype.toString` method

Turns out there is a third, arguably better way to check data types in JavaScript - we can use `Object.prototype.toString`. It is a method that exists on `Object.prototype` , which returns a string value used for the description of an objects based on its <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag'>`Symbol.toStringTag`</a>. Have you ever encountered an unexpected `[object Object]` bug? That was because the `toString` method got invoked before the your object was serialized properly.

If you take a look at <a href='https://262.ecma-international.org/6.0/#sec-object.prototype.tostring'>its spec</a> and you will realize that it is actually the all-encompassing solution we have been looking for when it comes to check data types.

```js
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call("1") // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(new String("string")) // "[object String]"
Object.prototype.toString.call(function() {}) // "[object Function]"
Object.prototype.toString.call(null) //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(/123/g) //"[object RegExp]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call([]) //"[object Array]"
Object.prototype.toString.call(document) //"[object HTMLDocument]"
Object.prototype.toString.call(window) //"[object Window]
```

<div class='tip tip-right'><p>Yes '123' and new String('123') are different things in JavaScript. <a href='https://twitter.com/jaffathecake/status/1086204098830049280'>Check out this twitter</a> to learn more about this idiosyncrasy of JavaScript</p></div>

With a little bit of string processing using a regexp, we can come up with the following solution that can account for all cases.

```js
function getType(obj) {
  const lowerCaseTheFirstLetter = str => str[0].toLowerCase() + str.slice(1)
  let type = typeof obj
  if (type !== "object") {
    return type
  }

  return lowerCaseTheFirstLetter(
    Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, "$1")
  )
}
getType([]) // "array"
getType("123") // "string"
getType(new String("123")) // "string"
getType(window) // "window"
getType(null) // "null"
getType(undefined) // "undefined"
getType() // "undefined"
getType(function() {}) // "function"
getType(/123/g) // "regExp"
getType(new Date()) // "date"
```

# Object

An object in JavaScript is a set of a collection of properties, in the form of key-value pairs, where the key can be either a string or a symbol and the value can be either an accessor (has `get`/`set` methods) or a data property (has a value).

Objects play two roles in JavaScript:

1. Records: Objects-as-records have a fixed number of properties, whose keys are known at development time. Their values can have different types.

2. Dictionaries: Objects-as-dictionaries have a variable number of properties, whose keys are not known at development time. All of their values have the same type. A hash table is a specific way to implement a dictionary.

before ES6, we have to use objects for both use cases. However, since `Map` was introduced in ES6, we should prefer `Map` when implementing a hash table or a dictionary. Defaulting to objects when a key/value structure is needed should really be considered an antipattern for modern JavaScript for a number of reasons:

- `Map` is much faster when it comes to dynamically inserting/setting/deleting keys at runtime. It is easy to convince yourself by benchmarking these operations on `Map` and plain old objects and compare the results. But <a href='https://leetcode.com/problems/random-pick-with-weight/discuss/671804/Javascript-with-explanation-and-very-interesting-find-regarding-vs-Map'>this is one post</a> that I found out when I was grinding leetcode that really does a good job of driving home this point about the performance gain of choosing `Map` over objects. Basically this dude were brute forcing a `n(o)` approach to solve a binary search problem using `Map` and he didn't get timed out on it. But as soon as he switched to plain old object, the solution timed out. I thought that was pretty funny.

- There are security caveats using objects as a hash table or dictionary. Dynamic keys can have rare name collisions with properties on `Object.prototype`, e.g. `hasOwnProperty` . In other words, the keys might pollute with other keys defined at the prototype chain. That opens the door for a form of attack called Prototype Pollution attack. <a href='https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/paper/JavaScript_prototype_pollution_attack_in_NodeJS.pdf'>Here is a whole paper</a> on this security topic if you are interested.

# Deep copy

There is no official definition for what a deep copying or a deep cloning is in JavaScript, as you cannot find it in the language's spec. However, the term is generally understood in the community. The way I like to describe deep copying is that, we start at the top-level entries of the object and traverse the tree and make copies of all the nodes in the tree, if we end up with a tree that has no references pointing back to the nodes on the original tree, then we have deep copied the object, otherwise it was a shallow copying or at least a non-deep copying.

There have been mountains of tutorials nowadays on shallow copying and deep copying in JavaScript, most of which are kind of flawed or at least not comprehensive enough to be able to account for various edge cases. These are a couple aspects that most of the deep copying tutorials fall short:

1. Non-enumberable properties on the object are not copied.
2. Symbol keys on the object are not copied.
3. Property descriptors of the properties on the object are not copied.
4. The prototype the object is based on, i.e. the value of the internal `[[Prototype]]` property is not copied.
5. Potential circular references are not addressed.

## Poor man's version

This is probably the easiest way you can think of when deep copying an object in JavaScript - first serialize it and then deserialize it back via `JSON.stringify` and `JSON.parse`

```js
let obj1 = { a:1, b:[1,2,3] }
let str = JSON.stringify(obj1)；
let obj2 = JSON.parse(str)；// { a:1, b:[1,2,3] }
```

The significant downside of this approach is that we can only copy properties with keys and values that are supported by JSON. Some unsupported keys and values are simply ignored and there are a bunch of other shortcomings like `Date` will be converted into `string` and `NaN`, `Inifity` will become `null`.

## Basic version

Let's write a more sophisticated, recursive solution that doesn't rely on `JSON.stringify` and `JSON.parse`

```js
const isReferenceDataType = obj =>
  (typeof obj === "object" || typeof obj === "function") && obj !== null

function getType(obj) {
  const lowerCaseTheFirstLetter = str => str[0].toLowerCase() + str.slice(1)
  let type = typeof obj
  if (type !== "object") return type

  return lowerCaseTheFirstLetter(
    Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, "$1")
  )
}

function deepCopy(target) {
  if (!isReferenceDataType(target)) return target
  const type = getType(target)
  if (type === "set") {
    clonedTarget = new Set()
    target.forEach(item => {
      clonedTarget.add(deepCopy(item))
    })
    return clonedTarget
  }
  if (type === "map") {
    clonedTarget = new Map()
    target.forEach((value, key) => {
      clonedTarget.set(key, deepCopy(value))
    })
    return clonedTarget
  }
  if (type === "function") {
    return target
  }
  if (type === "array") {
    return target.map(item => deepCopy(item))
  }
  if (type === "date") {
    return new Date(target)
  }
  if (type === "regExp") {
    return new RegExp(target)
  }

  return Object.fromEntries(
    Object.entries(target).map(([key, value]) => [key, deepCopy(value)])
  )
}
```

This solution seems fine and it probably is going to be an ok answer if you encounter this question under technical interview settings. However there are still a few cases where this solution just doesn't cut it:

1. The current solution will just ignore the keys that are symbols since they are hidden from `Object.entries`, the same thing with any other properties that are non-enumerable. As a result, property descriptors are not respected or not copied into the new objects either.

```js
const object = {
  [Symbol("symbol")]: "symbol",
}

Object.defineProperty(object, "non-enumerable", {
  enumerable: false,
  value: "non-enumerable",
})

const copiedObject = deepCopy(object) // {} - empty object
```

2. The prototype is still not copied.

```js
const proto = {}
const obj = Object.create(proto)
Object.getPrototypeOf(obj) === proto // true
const newObj = deepCopy(obj)
Object.getPrototypeOf(newObj) === proto // false
```

3. If the object has circular reference, the current solution will break and cause a stack overflow by recursion into an infinite loop.

```js
const object = {
  prop1: undefined,
}
object.prop1 = object
```

Let's address them all in the final version.

## Final version

First, for symbol keys or keys are not enumerable, we cannot use either for...in loop or Object.keys to access them. However they can be revealed by `Reflect.ownKeys`. <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties#detection_table '>Check out this MDN page</a> to learn more about it.

Second, to get all property descriptors at once, we can use the method `Object.getOwnPropertyDescriptors`, and together with `Object.create` and `Object.getPrototypeOf` we can copy the prototype along with the object.

Lastly, to prevent the crash caused by circular reference, we need to have an extra layer of cache to store the relationship between the current object and the copied objects. We do this by first checking to see if the cache has the copy, return it if it does, and continue copying if it does not. That also means the keys in the cache can be of reference types. There are only two types of data structure in JavaScript can store reference types as the keys - `Map` and `WeakMap`. And this is a legit use case for `WeakMap`, since the cache is an additional data storage and we don't want the cache to prevent garbage-collection of key objects.

<div class='tip tip-right'><p>Keys in a WeakMap are <a href='https://en.wikipedia.org/wiki/Weak_reference#:~:text=In%20computer%20programming%2C%20a%20weak,collector%2C%20unlike%20a%20strong%20reference.'>weakly referenced</a>, so it can prevent memory leak.</p></div>

```js
const isReferenceDataType = obj =>
  (typeof obj === "object" || typeof obj === "function") && obj !== null

function getType(obj) {
  const lowerCaseTheFirstLetter = str => str[0].toLowerCase() + str.slice(1)
  let type = typeof obj
  if (type !== "object") return type

  return lowerCaseTheFirstLetter(
    Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, "$1")
  )
}

function deepCopy(target, cache = new WeakMap()) {
  if (!isReferenceDataType(target)) return target
  const type = getType(target)
  if (type === "set") {
    clonedTarget = new Set()
    target.forEach(item => {
      clonedTarget.add(deepCopy(item))
    })
    return clonedTarget
  }
  if (type === "map") {
    clonedTarget = new Map()
    target.forEach((value, key) => {
      clonedTarget.set(key, deepCopy(value))
    })
    return clonedTarget
  }
  if (type === "function") {
    return target
  }
  if (type === "array") {
    return target.map(item => deepCopy(item))
  }
  if (type === "date") {
    return new Date(target)
  }
  if (type === "regExp") {
    return new RegExp(target)
  }
  if (cache.has(target)) return cache.get(target)
  const propertyDescriptors = Object.getOwnPropertyDescriptors(target)
  const clonedTarget = Object.create(
    Object.getPrototypeOf(target),
    propertyDescriptors
  )
  cache.set(target, clonedTarget)
  for (const key of Reflect.ownKeys(target)) {
    clonedTarget[key] =
      isReferenceDataType(target[key]) && getType(target[key]) !== "function"
        ? deepCopy(target[key], cache)
        : target[key]
  }

  return clonedTarget
}
```

However I need to point out that this solution is still not perfect. For example, it doesn't copy errors that are of the `Error` type. It is fair to say that implementing copying completely generically in JavaScript generally impossible.

# Bonus

I feel like grinding Leetcode might actually be a running theme in my blog. Here is a question on it called <a href='https://leetcode.com/problems/clone-graph/'>Clone Graph</a> that is basically asking you to deep copy an object with circular reference in it. Give it a try. And this is my solution:

```js
var cloneGraph = function(node) {
  const map = new WeakMap()

  return dfs(node)

  function dfs(node) {
    if (!node) return

    if (map.has(node)) return map.get(node)

    const newNode = new Node(node.val)
    map.set(node, newNode)
    const childNodes = []
    for (const neignbor of node.neighbors) {
      childNodes.push(dfs(neignbor, map))
    }
    newNode.neighbors = childNodes

    return newNode
  }
}
```

Actually you can just use regular `Map` instead of `WeakMap` in this case since the objects won't get garbage collected until synchronous JavaScript has finished processing. The garbage collector only runs once the script is idle. Because we are not doing anything asynchronous here, there is really no benefit to using a `WeakMap` over a `Map`. But I would still probably use `WeakMap` if I got this question in an interview, just to impress the interviewer lol.
