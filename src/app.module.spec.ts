import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./app.module";

describe("The Last of Guss - E2E", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let userId: string;
  let adminId: string;
  let roundId: string;
  let jwtToken: string;
  const cooldownWaitTime = Number(process.env.COOLDOWN_DURATION_SEC) * 1000;
  const rouindEndTime = Number(process.env.ROUND_DURATION_MIN) * 60 * 1000;

  it("Register and login user", async () => {
    const username = "survivor1";
    const password = "password123";

    const res = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username, password })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.username).toBe(username);
    userId = res.body.id;
  });

  it("Register and login admin", async () => {
    const username = "admin1";
    const password = "adminpass";

    const res = await request(app.getHttpServer())
      .post("/users/login")
      .send({ username, password })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.role).toBe("admin");
    adminId = res.body.id;
  });

  it("Login via auth and get JWT", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "survivor1", password: "password123" })
      .expect(201);

    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user.username).toBe("survivor1");
    jwtToken = res.body.accessToken;
  });

  it("Admin can create a round", async () => {
    const res = await request(app.getHttpServer())
      .post("/rounds")
      .send({ createdBy: adminId, durationMinutes: 1 })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    roundId = res.body.id;
    expect(res.body.totalPoints).toBe("0"); // TODO: fix this, should be 0 not "0"
  });

  it("User can't tap in the round, cooldown", async () => {
    const res = await request(app.getHttpServer())
      .post(`/rounds/${roundId}/tap`)
      .send({ userId })
      .expect(400);
  });

  it("User can tap in the round", async () => {
    // wait for cooldown to pass
    await new Promise((resolve) => setTimeout(resolve, cooldownWaitTime));
    const res = await request(app.getHttpServer())
      .post(`/rounds/${roundId}/tap`)
      .send({ userId })
      .expect(201);

    expect(res.body).toHaveProperty("myTaps");
    expect(res.body).toHaveProperty("myPoints");
    expect(res.body.myTaps).toBeGreaterThanOrEqual(1);
    expect(res.body.myPoints).toBeGreaterThanOrEqual(1);
  });

  it("Check round total points updated", async () => {
    await new Promise((resolve) => setTimeout(resolve, rouindEndTime));
    console.log(roundId, "test12");
    const res = await request(app.getHttpServer())
      .get(`/rounds/${roundId}`)
      .expect(200);

    expect(res.body.totalPoints).toBeGreaterThanOrEqual(1);
  });
});
