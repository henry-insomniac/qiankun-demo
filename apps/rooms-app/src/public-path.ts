declare let __webpack_public_path__: string;

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  }
}

if (window.__POWERED_BY_QIANKUN__ && window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export {};

