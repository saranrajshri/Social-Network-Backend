const request = require("supertest");
const app = require("../server");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmNDdmZTUxYjE2MGE5MjEyYzViZTE1ZCIsInBob25lTnVtYmVyIjoxMDIwNDA2NzkwfSwiaWF0IjoxNTk4NjIzNDgzfQ.l96P0C_j5C6uyEQOT0U1K569TlUAzI30qJnYAIHKuCU";

/**
 * Create a new user account
 */
// describe("User Endpoints", () => {
//   it("Create a new user account", async () => {
//     const res = await request(app).post("/api/v1/user/add").send({
//       name: "Shri Saran Raj",
//       phoneNumber: 2222222222,
//       password: "password",
//       age: 21,
//     });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("_id");
//   });
// });

/**
 * User Login
 */
describe("User Endpoints", () => {
  it("Login into user account", async () => {
    const res = await request(app).post("/api/v1/user/login").send({
      phoneNumber: 1020406790,
      password: "password",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");

    afterAll(() => {
      done();
    });
  });
});

/**
 * Get user timeline posts
 */

describe("User Endpoints", () => {
  it("Get the timeline posts of the user", async () => {
    const res = await request(app)
      .get("/api/v1/user/getTimeLine")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    afterAll(() => {
      done();
    });
  });
});

/**
 * Find a user
 */
describe("User Endpoints", () => {
  it("Find a user", async () => {
    const userToBeFound = "5f47fe51b160a9212c5be15d";

    const res = await request(app)
      .get(`/api/v1/user/find/${userToBeFound}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");

    afterAll(() => {
      done();
    });
  });
});
