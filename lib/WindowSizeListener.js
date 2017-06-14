/**
 * WindowSizeListener
 * React component for listening to window resize events
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var debounce = require('lodash.debounce');

var WindowSizeListener = (function (_React$Component) {
  _inherits(WindowSizeListener, _React$Component);

  function WindowSizeListener(props) {
    _classCallCheck(this, WindowSizeListener);

    _get(Object.getPrototypeOf(WindowSizeListener.prototype), 'constructor', this).call(this, props);
    this.displayName = 'WindowSizeListener';
    this._listeners = [];
    this.DEBOUNCE_TIME = 100;
    this.onResize = this.onResize.bind(this);
  }

  _createClass(WindowSizeListener, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.onResize !== this.props.onResize;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Defer creating _debouncedResize until it's mounted
      // This allows users to change DEBOUNCE_TIME if they want
      // If there's no listeners, we need to attach the window listener
      if (!this._listeners.length) {
        this._debouncedResize = debounce(this.onResize, this.DEBOUNCE_TIME);
        window.addEventListener('resize', this._debouncedResize, false);
      }
      this._listeners.push(this.props.onResize);
      this._debouncedResize();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var idx = this._listeners.indexOf(this.props.onResize);
      this._listeners.splice(idx, 1);
      if (!this._listeners.length) {
        window.removeEventListener('resize', this._debouncedResize, false);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.onResize !== this.props.onResize) {
        var idx = this._listeners.indexOf(this.props.onResize);
        this._listeners.splice(idx, 1, nextProps.onResize);
      }
    }

    /**
     * Resize handler
     * Gets the window size and calls eacg listener
     * @private
     */
  }, {
    key: 'onResize',
    value: function onResize() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      this._listeners.forEach(function (listener) {
        listener({ windowWidth: windowWidth, windowHeight: windowHeight });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }, {
    key: 'DEBOUNCE_TIME',
    get: function get() {
      return this._DEBOUNCE_TIME;
    },
    set: function set(value) {
      this._DEBOUNCE_TIME = value;
    }
  }]);

  return WindowSizeListener;
})(React.Component);

WindowSizeListener.propTypes = {
  onResize: PropTypes.func.isRequired
};

module.exports = WindowSizeListener;