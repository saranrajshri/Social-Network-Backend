const request = require("supertest");
const app = require("../server");
const comment = require("../models/CommentSchema");

const agent = request(app);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmNDdmZTUxYjE2MGE5MjEyYzViZTE1ZCIsInBob25lTnVtYmVyIjoxMDIwNDA2NzkwfSwiaWF0IjoxNTk4NjIzNDgzfQ.l96P0C_j5C6uyEQOT0U1K569TlUAzI30qJnYAIHKuCU";

/**
 * User Login
 */
// describe("Post Endpoints", () => {
//   it("Add a new post", async () => {
//     const res = await request(app)
//       .post("/api/v1/post/add")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         title: "This is title",
//         description: "This is a test message",
//       });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("_id");
//   });
// });

describe("Post Endpoints", () => {
  it("Find a post", async () => {
    const postID = "5f491545509ec23c6a8f9458";
    const res = await agent
      .get(`/api/v1/post/find/${postID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
  });
});

describe("Post Endpoints", () => {
  it("Add like to a post", async () => {
    const postID = "5f491545509ec23c6a8f9458";
    const res = await agent
      .post(`/api/v1/post/addLike/${postID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
  });
});

describe("Post Endpoints", () => {
  it("Unlike a post", async () => {
    const postID = "5f491545509ec23c6a8f9458";
    const res = await agent
      .post(`/api/v1/post/unLike/${postID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
  });
});

describe("Post Endpoints", () => {
  it("Add a comment to a post", async () => {
    const postID = "5f491545509ec23c6a8f9458";
    const res = await agent
      .post(`/api/v1/post/addComment/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post: postID,
        comment: "This is a comment from supertest",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
  });
});
