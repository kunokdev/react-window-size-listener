/**
 * WindowSizeListener
 * React component for listening to window resize events
 */
import React from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

class WindowSizeListener extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "WindowSizeListener";
    this._listeners = [];
    this.DEBOUNCE_TIME = 100;
    this.onResize = this.onResize.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.onResize !== this.props.onResize;
  }

  componentDidMount() {
    // Defer creating _debouncedResize until it's mounted
    // This allows users to change DEBOUNCE_TIME if they want
    // If there's no listeners, we need to attach the window listener
    if (!this._listeners.length) {
      this._debouncedResize = debounce(this.onResize, this.DEBOUNCE_TIME);
      window.addEventListener("resize", this._debouncedResize, false);
    }
    this._listeners.push(this.props.onResize);
    this._debouncedResize();
  }

  componentWillUnmount() {
    const idx = this._listeners.indexOf(this.props.onResize);
    this._listeners.splice(idx, 1);
    if (!this._listeners.length) {
      window.removeEventListener("resize", this._debouncedResize, false);
    }
  }

  // componentWillReceiveProps(nextProps){
  //   if (nextProps.onResize !== this.props.onResize) {
  //     const idx = this._listeners.indexOf(this.props.onResize)
  //     this._listeners.splice(idx, 1, nextProps.onResize)
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.onResize !== this.props.onResize) {
      const idx = this._listeners.indexOf(prevProps.onResize);
      this._listeners.splice(idx, 1, this.props.onResize);
    }
  }

  /**
   * Resize handler
   * Gets the window size and calls eacg listener
   * @private
   */
  onResize() {
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this._listeners.forEach(listener => {
      listener({ windowWidth, windowHeight });
    });
  }

  render() {
    return this.props.children ? this.props.children : null;
  }

  get DEBOUNCE_TIME() {
    return this._DEBOUNCE_TIME;
  }

  set DEBOUNCE_TIME(value) {
    this._DEBOUNCE_TIME = value;
  }
}

WindowSizeListener.propTypes = {
  onResize: PropTypes.func.isRequired
};

export function withWindowSizeListener(Component) {
  return class withWindowSizeListener extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        windowSize: {
          windowWidth:
            (window && window.innerWidth) ||
            (document &&
              ((document.documentElement && document.documentElement.clientWidth) ||
                (document.body && document.body.clientWidth))) ||
            null,
          windowHeight:
            (window && window.innerHeight) ||
            (document && (document.documentElement.clientHeight || document.body.clientHeight)) ||
            null
        }
      };
    }

    render() {
      return (
        <WindowSizeListener onResize={windowSize => this.setState({ windowSize })}>
          <Component {...this.props} windowSize={this.state.windowSize} />
        </WindowSizeListener>
      );
    }
  };
}

export default WindowSizeListener;
