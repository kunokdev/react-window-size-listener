declare module "react-window-size-listener" {
  import React from "react";

  interface Props {
    onResize: () => any;
    children?: any;
  }

  export class WindowSizeListener<Props> {
    private _listeners: any[];
    public displayName: string;
  }

  export type withWindowSizeListener = <P>(
    Component: React.Element | React.ComponentType<P | any>
  ) => WindowSizeListener;
}
