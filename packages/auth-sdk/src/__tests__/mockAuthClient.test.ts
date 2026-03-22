import { createMockAuthClient } from "../mockAuthClient";

describe("mock auth client", () => {
  it("starts authenticated and exposes a demo user", async () => {
    const client = createMockAuthClient();

    expect(client.isAuthenticated()).toBe(true);
    await expect(client.getCurrentUser()).resolves.toMatchObject({
      id: "demo-user",
      tenantId: "tenant-demo",
    });
  });

  it("notifies listeners when the session changes", async () => {
    const client = createMockAuthClient();
    const snapshots: boolean[] = [];

    const unsubscribe = client.subscribe((session) => {
      snapshots.push(session.authenticated);
    });

    await client.logout();
    unsubscribe();

    expect(snapshots).toEqual([true, false]);
  });
});

