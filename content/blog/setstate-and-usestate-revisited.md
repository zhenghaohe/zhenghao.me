---
path: setState-and-useState-Revisited
date: 2020-06-09T22:37:46.911Z
title: 'setState and useState: Revisited'
description: ' there are lots of subtle nuances about them and they can definitely bite you if you are not careful. '
tag: engineering
---
If you are writing React, you definitely are no stranger to \`setState\` and  \`useState\` . These are the two primary ways to update the state in your application. This post aims to unpack all the quirky behaviours around these two APIs. If you are a seasoned React developer, you probably know all of them by now. That said, it is still worth revisiting them since there are lots of subtle nuances about them and they can definitely bite you if you are not careful. 

We are going to take a look at a very simple counter. Out of the box, it doesn’t have a lot going on.

\`\``jsx

class Counter extends Component {

state = { count: 0 };

increment = () => {

this.setState({ count: this.state.count + 1 });

};

decrement = () => {

this.setState({ count: this.state.count - 1 });

};

reset = () => {

 this.setState({ count: 0 });

};

render() {

return (

 <main className="Counter">

 <p className="count">{this.state.count}</p>

 <section className="controls">

 <button onClick={this.increment}>Increment</button>

 <button onClick={this.decrement}>Decrement</button>

 <button onClick={this.reset}>Reset</button>

 </section>

 </main>

 );

}

}

render(<Counter />, document.getElementById('root'));

\`\``

<iframe

  src="https://codesandbox.io/embed/counter-class-based-kf380?fontsize=14&hidenavigation=1&theme=dark"

  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"

  title="hooks/useMemo"

  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"

  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"

\></iframe>



\### useState

First let’s take an uncomfortably close look at the  \`useState\` API. The first well-known quirk about \`useState\` is that it is asynchronous. It can certainly be a recipe for headaches.

let’s say we refactored \`increment()\` as follows:

\`\``js

increment() {

this.setState({ count: this.state.count + 1 });

this.setState({ count: this.state.count + 1 });

this.setState({ count: this.state.count + 1 });

console.log(this.state.count);

}

\`\``

Take a lucky guess about what the value that gets logged out would be and what value the count would be updated to?

If the initial count is \`0\`, after we click on increment. The state will be \`1\` instead of \`3\`, because React will batch the operations up, figuring out the result and efficiently make that change. Also it will log out \`0\` instead \`1\` since \`setState\` is async.

<div class='tip tip-right'>

This is explained in the documentation of setState.

setState() does not immediately mutate this.state but creates a pending state transition. Accessing this.state after calling this method can potentially return the existing value. There is no guarantee of synchronous operation of calls to setState and calls may be batched for performance gains.

</div>

Now we refactored \`increment()\`  again as follows:

\`\``js

increment = () => {

 this.setState({ count: this.state.count + 1 });

 this.setState({ count: this.state.count + 2 });

 this.setState({ count: this.state.count + 3 });

 console.log('this.state.count', this.state.count);

};

\`\``

What will the new value of the state be?

If the initial count is still \`0\`, after we click on \`increment\`. The state will be \`3\` and it will still log out \`0\`. 

This is due to another feature of \`setState\`: it does **shallow merge** to update state.  

This means that the above operation is effectively as follows

\`\``js

Object.assign(

{},

yourFirstCallToSetState,

yourSecondCallToSetState,

yourThirdCallToSetState

)

// or 

const newState = {

...yourFirstCallToSetState,

... yourSecondCallToSetState,

... yourThirdCallToSetState

}

\`\``

When there’s duplicate keys, the last one wins. 

So far we are calling \`setState\` with by passing in an object to the API to update the state. However, it turns out that \`setState\`  also takes in a function as an argument. 

This means that we can refactor \`increment()\` as follows.

\`\``js

this.setState(state => {

return { count: state.count + 1 };

});

\`\``

Or use destructuring to make it evening cleaner.

\`\``js

increment() {

this.setState(({ count }) => {

 return { count: count + 1 };

});

}

\`\``

Since we can only merge objects in JavaScript not functions, when we update the state multiple times in a row, they will can behave as expected i.e. the effect will stack up and the state would be updated all at once.

If we rewrite the previous increment into

\`\``js

increment = () => {

 this.setState(({ count }) => ({ count: count + 1 }));

 this.setState(({ count }) => ({ count: count + 1 }));

 this.setState(({ count }) => ({ count: count + 1 }));

 console.log('this.state.count', this.state.count);

};

\`\``

The state would be updated to \`3\` after we click the button, as opposed to \`1\` as we saw before.(However the logged out value would still be \`0\` since this syntax does not change the asynchronicity nature of the API) 

When adopting this syntax, there are lots of potentially cool things we could do here. For example, we could add some logic to our component.

Let’s stay, we wanted to add in a maximum count as a prop.

\`\``js

increment = () => {

 this.setState((state) => {

	const {count} = state	

 const { max, step } = this.props;

 if (count >= max) return; // notice here I didn't return anything. This is the same as return {count: this.state.count}. If we return nothing, it will not update the state

 return { count: count + step };

 });

};

\`\``

But there is a catch. Now the function we passed into \`this.setState\` also replies on \`this.props\` . You can see that this is not going to be good for testing, since we have to mount the entire component and pass in props in order to test it. But turns out that we can actually have a second argument in there as well — the \`props\`

\`\``js

increment = () => {

 this.setState(({count}, {max, step})=> {

 if(count >= max) return

 return {count: count + step}

 });

};

\`\``

This allows us to pull the function that got passed into \`setState\` out of the component. This makes it way easier to unit test without having to mount the entire component.

After extracting the function out, we get

\`\``js

const incrementHelper = ({ count }, props) => {

const { max, step } = props;

if (count >= max) return;

return { count: count + step };

};

class Counter extends Component {

state = getStateFromLocalStorage();

increment = () => {

 this.setState(incrementHelper)}

\`\``

One last piece about \`useState\`. Before we talked about that it is async. What if we actually want to access the updated state? In JavaScript, the way to access async data is normally through callback functions. And unsurprisingly, \`setState\` takes a second argument in addition to either the object or function. This function is called after the state change has happened. 

Based on the example above, we can have 

\`\``js

this.setState(increment, () => console.log(this.state));

\`\``

This time, when we click the button, we will see the updated state gets logged out.

This additional callback we have here allows us to perform some side effects that we wish to happen after the state is updated.

One use case would be that we can use \`LocalStorage\` to update the cached state every time \`setState\` is called

\`\``js

increment = () => {

 this.setState(

 ({ count }, props) => {

 const { max, step } = props;

 if (count >= max) return;

 return { count: count + step };

 },

 () => {

 localStorage.setItem('counterState', JSON.stringify(this.state));

 },

 );

};

\`\``

It would be cool if we can extract the second function out and do something like this

\`\``js

increment() {

  this.setState(increment, storeStateInLocalStorage);

}

\`\``

However t doesn’t work. it’s a bummer that the callback function does not have a copy of the state. It does not get any arguments. We could wrap it into a function and then pass the state in, or we can put the function onto the class component itself. i.e. it is a method of the class. Either way, we will lose the testability that we have for the first function argument of \`setState\`

\### useState

Now it’s 2020, let’s use Hooks like everyone else is doing.

Get ready to delete lots of code.

\`\``javascript

const Counter = ({ max, step }) => {

const \[count, setCount] = useState(0);

const increment = () => setCount(count + 1);

const decrement = () => setCount(count - 1);

const reset = () => setCount(0);

return (

 <main className="Counter">

 <p className="count">{count}</p>

 <section className="controls">

 <button onClick={increment}>Increment</button>

 <button onClick={decrement}>Decrement</button>

 <button onClick={reset}>Reset</button>

 </section>

 </main>

);

};

\`\``
