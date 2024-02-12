import request from "supertest";

const url = "http://localhost:5000"

describe("http server tests", () => {
  describe('1 - Get initial DB, add user, change user, delete user', function () {
    it('get initial DB', function (done) {
      request(url)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect('[]', done);
    });
    it('add user', async function () {
      const newUser = {
        username: "Oleg",
        age: 12,
        hobbies: [],
      }
      const resp = await request(url)
        .post('/api/users')
        .send(newUser);

      const respObj = JSON.parse(resp.text);
      delete respObj.id;
      expect(resp.status).toBe(201);
      expect(respObj).toEqual(newUser);
    });
    it('update user', async function () {
      let resp = await request(url)
        .get('/api/users');
      let respObj = resp.body;
      expect(respObj.length).toBe(1);
      const id = respObj[0].id;
      const updatedUser = {...respObj[0], age: 18}

      resp = await request(url)
        .put(`/api/users/${id}`)
        .send(updatedUser);

      respObj = resp.body;
      expect(resp.status).toBe(200);
      expect(respObj).toEqual(updatedUser);
    });
    it('delete user', async function () {
      let resp = await request(url)
        .get('/api/users');
      let respObj = resp.body;
      expect(respObj.length).toBe(1);
      const id = respObj[0].id;

      resp = await request(url)
        .delete(`/api/users/${id}`);
      expect(resp.status).toBe(204);
      expect(resp.text).toBe("");


      resp = await request(url)
        .get('/api/users');
      expect(resp.status).toBe(200);
      expect(resp.text).toBe("[]");
    });
  });

  describe('2 - Add user, delete user, try to change nonexistent user, try to delete nonexistent user', function () {
    let checkedId = "";
    it('add user', async function () {
      const newUser = {
        username: "Oleg",
        age: 12,
        hobbies: [],
      }
      const resp = await request(url)
        .post('/api/users')
        .send(newUser);

      const respObj = JSON.parse(resp.text);
      checkedId = respObj.id;
      delete respObj.id;
      expect(resp.status).toBe(201);
      expect(respObj).toEqual(newUser);
    });
    it('delete user', async function () {
      let resp = await request(url)
        .get('/api/users');
      let respObj = resp.body;
      expect(respObj.length).toBe(1);

      resp = await request(url)
        .delete(`/api/users/${checkedId}`);
      expect(resp.status).toBe(204);
      expect(resp.text).toBe("");


      resp = await request(url)
        .get('/api/users');
      expect(resp.status).toBe(200);
      expect(resp.text).toBe("[]");
    });
    it('update user', async function () {
      let resp = await request(url)
        .get('/api/users');
      let respObj = resp.body;
      expect(respObj.length).toBe(0);
      const updatedUser = {...respObj[0], age: 18}

      resp = await request(url)
        .put(`/api/users/${checkedId}`)
        .send(updatedUser);

      expect(resp.status).toBe(404);
    });
    it('delete user', async function () {
      let resp = await request(url)
        .get('/api/users');
      let respObj = resp.body;
      expect(respObj.length).toBe(0);
      const updatedUser = {...respObj[0], age: 18}

      resp = await request(url)
        .put(`/api/users/${checkedId}`)
        .send(updatedUser);

      expect(resp.status).toBe(404);
    });

  })

  describe('3 - Add incorrect user, delete incorrect ID + nonexistent user, try to change incorrect + nonexistent ID user, get incorrect url', function () {

    it('add user', async function () {
      const newUser = {
        username: "Oleg",
        age: true,
        hobby: [],
      }
      const resp = await request(url)
        .post('/api/users')
        .send(newUser);

      expect(resp.status).toBe(400);
      expect(resp.text).toBe("Not contain required fields");
    });
    it('delete noUUID user', async function () {
      const resp = await request(url)
        .delete(`/api/users/123`);
      expect(resp.status).toBe(400);
      expect(resp.text).toBe("User ID is invalid");
    });
    it('delete nonexistent user', async function () {
      const resp = await request(url)
        .delete('/api/users/49736dd3-7aa3-4809-ad4a-73f80f345ad3');
      expect(resp.status).toBe(404);
      expect(resp.text).toBe("Record doesn't exist");
    });
    it('update noUUID user', async function () {
      const updatedUser = {
        username: "Oleg",
        age: 12,
        hobbies: [],
      }
      const resp = await request(url)
        .put('/api/users/123')
        .send(updatedUser);
      expect(resp.status).toBe(400);
      expect(resp.text).toBe("User ID is invalid");
    });
    it('update nonexistent user', async function () {
      const updatedUser = {
        username: "Oleg",
        age: 12,
        hobbies: [],
      }
      const resp = await request(url)
        .put('/api/users/49736dd3-7aa3-4809-ad4a-73f80f345ad3')
        .send(updatedUser);
      expect(resp.status).toBe(404);
      expect(resp.text).toBe("Record doesn't exist");
    });
    it('get notExistingEndpoint', function (done) {
      request(url)
        .get('/api/user')
        .expect(404)
        .expect('Content-Type', 'text/plain')
        .expect("url doesn't exist", done);
    });
  })
})

