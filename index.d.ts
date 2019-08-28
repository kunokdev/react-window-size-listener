declare module "react-window-size-listener" {
  import React from "react";

  interface Props {
    onResize: () => any;
    children?: any;
  }

  export class WindowSizeListener extends React.Component<Props> {
    private _listeners: any[];
    public displayName: string;
  }

  export type withWindowSizeListener = <P>(Component: React.ComponentType<P>) => any;
}
