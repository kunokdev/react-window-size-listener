# react-window-size-listener

React component for listening to window resize events.

This is ES6 rewrite of [react-window-resize-listener](https://github.com/cesarandreu/react-window-resize-listener) due to deprecation warnings and many developers commented on this issue without getting any response for a while.

## Installation

```sh
npm install react-window-size-listener --save
```

## API

### `<WindowSizeListener onResize/>`

React component that takes a single onResize callback which is called every time the window is resized.

#### Props

* `void onResize(windowSize)` - Callback that gets called every time the window is resized. It's always called once soon after getting mounted. Receives a `windowSize` param which is an Object with keys `windowHeight` and `windowWidth`, both values are numbers.

#### Example

As regular component:

```jsx
import WindowSizeListener from 'react-window-size-listener'
import ReactDOM from 'react-dom'
import React from 'react'

ReactDOM.render(
  <div>
    <WindowSizeListener onResize={windowSize => {
      console.log('Window height', windowSize.windowHeight)
      console.log('Window width', windowSize.windowWidth)
    }}/>
  </div>,
  document.getElementById('app')
)
```

alternatively you can render it with children:

```jsx
<WindowSizeListener
  onResize={(windowSize) => console.log(windowSize)}
>
  <h1>Hello world!</h1>
</WindowSizeListener>
```

or as Higher Order Component (HOC):

```jsx
import React from 'react';
import { withWindowSizeListener } from 'react-window-size-listener';

class App extends React.Component {
  render() {
    return (
      <span>
        {this.props.windowSize.windowWidth}
        {this.props.windowSize.windowHeight}
      </span>
    );
  }
}

export default withWindowSizeListener(App);

```


### `WindowSizeListener.DEBOUNCE_TIME`

Numeric value of how much time should be waited before calling each listener function. Default value is `100`.

The debounce function is created lazily when the component instance is mounted, so you can change the value before mounting.

## Details

This component lazily adds the window resize event listener, this means it works with universal apps. The listener only get added when a component instance gets mounted.

To avoid performance problems associated with registering multiple event listeners, it only registers a single listener which is shared among all component instances.

## License

MIT
