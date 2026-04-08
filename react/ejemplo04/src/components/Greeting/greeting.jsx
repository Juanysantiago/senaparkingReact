import { Fragment } from "react";


export function Greeting() {
  const name = "John"
  {/* The result will be Hello John*/}
  return <h1 className="title">Hello {name}</h1>;
}

export function Greeting2() {
  const name = "John";
  return (
    <Fragment>
      <h1>Hello {name}</h1>
      <p>Nice to meet you.</p>
    </Fragment>
  );
}

