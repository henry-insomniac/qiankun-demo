import { createRoot, type Root } from "react-dom/client";

import "@qiankun-demo/design-tokens/styles.css";

import "./public-path";
import OrdersApp from "./App";

import type { ShellAppProps } from "@qiankun-demo/contracts";

let root: Root | null = null;

function render(props?: ShellAppProps): void {
  const container =
    props?.container?.querySelector("#root") ?? document.querySelector("#root");

  if (!container) {
    throw new Error("Orders micro app mount container #root not found.");
  }

  if (!root) {
    root = createRoot(container);
  }

  root.render(<OrdersApp shellProps={props} />);
}

export async function bootstrap(): Promise<void> {}

export async function mount(props: ShellAppProps): Promise<void> {
  render(props);
}

export async function unmount(): Promise<void> {
  root?.unmount();
  root = null;
}

if (!(window as Window & { __POWERED_BY_QIANKUN__?: boolean }).__POWERED_BY_QIANKUN__) {
  render();
}

