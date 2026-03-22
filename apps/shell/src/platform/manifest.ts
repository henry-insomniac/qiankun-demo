import {
  assertMicroAppManifest,
  type MicroAppManifest,
} from "@qiankun-demo/contracts";

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
    critical: true,
  },
];

for (const manifest of microAppManifests) {
  assertMicroAppManifest(manifest);
}

