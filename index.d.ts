declare module "react-window-size-listener" {
  import React from "react";

  interface WindowSize {
    windowWidth: number;
    windowHeight: number;
  }
  interface Props {
    onResize: (windowSize: WindowSize) => any;
    children?: any;
  }

  export default class WindowSizeListener extends React.Component<Props> {
    private _listeners: any[];
    public displayName: string;
  }

  export type withWindowSizeListener = <P>(Component: React.ComponentType<P>) => WindowSizeListener;
}
