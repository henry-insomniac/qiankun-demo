import {
  assertMicroAppManifest,
  type MicroAppManifest,
} from "@qiankun-demo/contracts";

declare const __ROOMS_APP_ENTRY__: string;

export const microAppManifests: MicroAppManifest[] = [
  {
    name: "orders-app",
    domain: "orders",
    entry: __ORDERS_APP_ENTRY__,
    activeRule: "/orders",
    mountContainer: "#micro-app-slot",
    routeBase: "/orders",
    ownerTeam: "platform",
    version: "0.1.0",
    standaloneUrl: __ORDERS_APP_ENTRY__,
    critical: false,
  },
  {
    name: "rooms-app",
    domain: "rooms",
    entry: __ROOMS_APP_ENTRY__,
    activeRule: "/rooms",
    mountContainer: "#micro-app-slot",
    routeBase: "/rooms",
    ownerTeam: "platform",
    version: "0.1.0",
    standaloneUrl: __ROOMS_APP_ENTRY__,
    critical: false,
  },
];

for (const manifest of microAppManifests) {
  assertMicroAppManifest(manifest);
}
