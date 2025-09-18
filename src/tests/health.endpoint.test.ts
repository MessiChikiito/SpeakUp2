import http from "http";
import app from "../infrastructure/web/app";

describe("GET /health", () => {
  it("responds with 200 and an ok status", async () => {
    const server = http.createServer(app);

    await new Promise<void>((resolve) => {
      server.listen(0, resolve);
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      server.close();
      throw new Error("Unable to determine server address");
    }

    try {
      const response = await makeRequest(address.port, "/health");

      expect(response.status).toBe(200);
      expect(response.body ?? {}).toMatchObject({ status: "ok" });
      if (response.body?.database) {
        expect(["connected", "disconnected"]).toContain(response.body.database);
      }
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    }
  });
});

type HealthPayload = { status?: string; database?: string };

function makeRequest(port: number, path: string): Promise<{ status: number; body: HealthPayload | undefined }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "GET",
      },
      (res) => {
        const chunks: Uint8Array[] = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          try {
            const payloadString = Buffer.concat(chunks).toString("utf-8");
            const body = payloadString ? JSON.parse(payloadString) : undefined;
            resolve({ status: res.statusCode ?? 0, body });
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}
