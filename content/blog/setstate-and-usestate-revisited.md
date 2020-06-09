---
path: setState-and-useState-Revisited
date: 2020-06-09T22:37:46.911Z
title: 'setState and useState: Revisited'
description: ' there are lots of subtle nuances about them and they can definitely bite you if you are not careful. '
tag: engineering
---
If you are writing React, you definitely are no stranger to \`setState\` and  \`useState\` . These are the two primary ways to update the state in your application. This post aims to unpack all the quirky behaviours around these two APIs. If you are a seasoned React developer, you probably know all of them by now. That said, it is still worth revisiting them since there are lots of subtle nuances about them and they can definitely bite you if you are not careful. 



We are going to take a look at a very simple counter. Out of the box, it doesn’t have a lot going on.



\`\``javascript

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
