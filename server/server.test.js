// This is where all tests are run

const supertest = require("supertest");
const app = require("./server");
const CustomerToken = process.env.ulmd;
const ManagerToken = process.env.ulmd2;

describe(" ** CUSTOMER ACCOUNT **", () => {
  describe("POST: CREATE CUSTOMER", () => {
    it("Should Return Email Taken error", async () => {
      const res = await supertest(app).post("/customers").send({
        FirstName: "Hussam",
        LastName: "Mouasvi",
        Email: "hm.mousavi.02@gmail.com",
        Password: "Hesam1376!",
        isMember: false,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.type).toEqual("error");
    });
    it("Should Return schema error", async () => {
      const res = await supertest(app).post("/customers").send({
        FirstName: "Hussam",
        Email: "v3sk@yahoo.com",
        Password: "12345678",
        isMember: false,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.type).toEqual("error");
    });
    // it("Should Create a new customer in the database", async () => {
    //   const res = await supertest(app).post("/customers").send({
    //     FirstName: "Hussam",
    //     LastName: "Mousavi",
    //     Email: "v3sk@yahoo.com",
    //     Password: "12345678",
    //     isMember: false,
    //   });
    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.message).toBeDefined();
    //   expect(res.body.type).toEqual("success");
    // });
  });
  describe("PUT: AMEND CUSTOMER", () => {
    it("Should Return error: NO UPDATE OBJECT", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({})
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type).toEqual("error");
    });
    it("Should Return schema error: Extra attributes", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({
          update: {
            _id: "63e66a4c14886ffc95b9fb53",
            isActive: false,
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type).toEqual("error");
    });
    it("Should Return schema error: NO _id", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({
          update: {
            // _id: "63e66a4c14886ffc95b9fb53",
            isMember: false,
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type).toEqual("error");
    });
    it("Should Return Email taken ", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({
          update: {
            _id: "6425a7ea41e835e90b066119",
            Email: "h@gmail.com",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type).toEqual("error");
    });
    it("Should Amend Membership: False", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({
          update: {
            _id: "63e66a4c14886ffc95b9fb53",
            isMember: false,
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toEqual("success");
    });
    it("Should Amend Membership: true", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({
          update: {
            _id: "63e66a4c14886ffc95b9fb53",
            isMember: true,
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toEqual("success");
    });
  });
  describe("PUT: /change-password", () => {
    it("Should Return schema error: NO CUSTOMER OBJECT", async () => {
      const res = await supertest(app)
        .put("/customers/change-password")
        .send({})
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type).toEqual("error");
    });
    it("Should Return schema error: Invalid Password", async () => {
      const res = await supertest(app)
        .put("/customers")
        .send({
          customer: {
            _id: "63e66a4c14886ffc95b9fb53",
            Password: "12345",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type).toEqual("error");
    });
    it("Should Change Password to: 123456789", async () => {
      const res = await supertest(app)
        .put("/customers/change-password")
        .send({
          customer: {
            _id: "6425a7ea41e835e90b066119",
            Password: "123456789",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toEqual("success");
    });
    it("Should Change Password to: Hesam1376!", async () => {
      const res = await supertest(app)
        .put("/customers/change-password")
        .send({
          customer: {
            _id: "6425a7ea41e835e90b066119",
            Password: "Hesam1376!",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toEqual("success");
    });
  });
  describe("POST: /customer/login", () => {
    it("Should Return schema error", async () => {
      const res = await supertest(app).post("/customer/login").send({
        Email: "hm.mousavi.02@gmail.com",
        // Password: "12345678",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.type).toEqual("error");
    });
    it("Should Return invalid Email error", async () => {
      const res = await supertest(app).post("/customer/login").send({
        Email: "v3sk@yaho.com",
        Password: "12345678",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.type).toEqual("error");
    });
    it("Should return incorrect password error", async () => {
      const res = await supertest(app).post("/customer/login").send({
        Email: "v3sk@yahoo.com",
        Password: "1234567",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.type).toEqual("error");
    });
    it("Should Log the customer in", async () => {
      const res = await supertest(app).post("/customer/login").send({
        Email: "hm.mousavi.02@gmail.com",
        Password: "Hesam1376!",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.Token).toBeDefined();
      expect(res.body.type).toEqual("success");
    });
  });
});
describe(" ** CUSTOMER / EMPLOYEE SESSIONS ** ", () => {
  describe("POST: /sessions/customer", () => {
    it("Should Return schema error", async () => {
      const res = await supertest(app)
        .post("/sessions/customer")
        .send({
          Email: "hm.mousavi",
          Facility: "Test",
          Activity: "Test",
          Date: "2023-01-01",
          Duration: 1,
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return schema error", async () => {
      const res = await supertest(app)
        .post("/sessions/customer")
        .send({
          Email: "hm.mousavi.02@gmail.com",
          Facility: "Test",
          Activity: "Test",
          Date: "2023-01-01",
          // Duration: 1,
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return Invalid Email error", async () => {
      const res = await supertest(app)
        .post("/sessions/customer")
        .send({
          Email: "hm.mousavi.01@gmail.com",
          Facility: "Test",
          Activity: "Test",
          Date: "2023-01-01",
          Duration: 1,
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    // it("Should Create a New session", async () => {
    //   const res = await supertest(app)
    //     .post("/sessions/customer")
    //     .send({
    //       Email: "hm.mousavi.02@gmail.com",
    //       Facility: "swimming pool",
    //       Activity: "general use",
    //       Date: "2023-03-01 12:00",
    //       Duration: 1,
    //     })
    //     .set({ Token: CustomerToken });
    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.type.toLowerCase()).toEqual("success");
    // });
  });
  describe("PUT: /sessions/customer", () => {
    it("Should Return insufficient attributes error ", async () => {
      const res = await supertest(app)
        .put("/sessions/customer")
        .send({})
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return Schema error", async () => {
      const res = await supertest(app)
        .put("/sessions/customer")
        .send({
          session: {
            _id: "63f14b4a87017ebc9441b1b3",
            // Email: "hm.mousavi.02@gmail.com",
            Facility: "studio",
            Date: "2023-05-09",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return error: invalid id", async () => {
      const res = await supertest(app)
        .put("/sessions/customer")
        .send({
          session: {
            _id: "3f14b4a87017ebc9441b1b3",
            Email: "hm.mousavi.02@gmail.com",
            Facility: "studio",
            Date: "2023-05-08",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(500);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should update Session: => 8:00", async () => {
      const res = await supertest(app)
        .put("/sessions/customer")
        .send({
          session: {
            _id: "6425bc50c89a2caeccbaa71b",
            Email: "hm.mousavi.02@gmail.com",
            Facility: "swimming pool",
            Activity: "general use",
            Date: "2023-05-08 12:00",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
    it("Should update Session: 17:00", async () => {
      const res = await supertest(app)
        .put("/sessions/customer")
        .send({
          session: {
            _id: "6425bc50c89a2caeccbaa71b",
            Email: "hm.mousavi.02@gmail.com",
            Facility: "swimming pool",
            Activity: "general use",
            Date: "2023-05-08 9:00",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("DELETE: /session/customer", () => {
    it("Should return schema error", async () => {
      const res = await supertest(app)
        .delete("/sessions/customer")
        .send({
          session: {
            Email: "hm.mousavi.02@gmail.com",
            // _id: "63f16808246ae2709c580a78",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should return session not found error", async () => {
      const res = await supertest(app)
        .delete("/sessions/customer")
        .send({
          session: {
            Email: "hm.mousavi.02@gmail.com",
            _id: "63f268eea9949802f21d4500",
          },
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Cancel session", async () => {
      const res = await supertest(app)
        .delete("/sessions/customer")
        .send({
          Email: "hm.mousavi.02@gmail.com",
          _id: "6425bc50c89a2caeccbaa71b",
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("GET: /session/customer", () => {
    it("Should get schema error", async () => {
      const res = await supertest(app)
        .get("/sessions/customer")
        .send({
          // Email: "hm.mousavi.02@gmail.com",
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return schema error", async () => {
      const res = await supertest(app)
        .get("/sessions/customer")
        .send({
          Email: "hmmouqsq",
        })
        .set({ Token: CustomerToken });
      expect(res.statusCode).toBe(400);
      // expect(res.body.message).toBeDefined();
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should get all booked sessions", async () => {
      const res = await supertest(app)
        .get("/sessions/customer")
        .set({ Token: CustomerToken, Email: "hm.mousavi.02@gmail.com" });
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
});
describe("** EMPLOYEE **", () => {
  describe("POST: CREATE EMPLOYEE", () => {
    it("Should Return error: Missing Email", async () => {
      const res = await supertest(app)
        .post("/employee")
        .send({
          // Email: "sports.centre.2023@gmail.com",
          employeeObj: {
            FirstName: "Employee",
            LastName: "Hesam",
            Email: "v3sk@yahoo.com",
            Password: "12345678",
            isSuspended: false,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return error: Missing Employee Object", async () => {
      const res = await supertest(app)
        .post("/employee")
        .send({
          Email: "sports.centre.2023@gmail.com",
          // employeeObj: {
          //   FirstName: "Employee",
          //   LastName: "Hesam",
          //   Email: "v3sk@yahoo.com",
          //   Password: "12345678",
          //   isSuspended: false,
          // },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return error: Email Taken", async () => {
      const res = await supertest(app)
        .post("/employee")
        .send({
          Email: "sports.centre.2023@gmail.com",
          employeeObj: {
            FirstName: "Employee",
            LastName: "Hesam",
            Email: "v3sk@yahoo.com",
            Password: "12345678",
            isSuspended: false,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return schema error: Missing Employee attributes", async () => {
      const res = await supertest(app)
        .post("/employee")
        .send({
          Email: "sports.centre.2023@gmail.com",
          employeeObj: {
            FirstName: "Employee",
            LastName: "Hesam",
            Email: "v3sk@yahoo.com",
            // Password: "12345678",
            isSuspended: false,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
  });
  describe("PUT: AMEND EMPLOYEE:", () => {
    it("Should Return error: Missing Update object", async () => {
      const res = await supertest(app)
        .put("/employee")
        .send({})
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    // it("Should Return error: Missing Update object", async () => {
    //   const res = await supertest(app)
    //     .put("/employee")
    //     .send({
    //       update: {
    //         _id: "63ee9bacb1477872e853e1d5",
    //         // isSuspended: false,
    //       },
    //     })
    //     .set({ Token: ManagerToken });
    //   expect(res.statusCode).toBe(400);
    //   expect(res.body.type.toLowerCase()).toEqual("error");
    // });
    it("Should update employee object: isSuspended => true", async () => {
      const res = await supertest(app)
        .put("/employee")
        .send({
          update: {
            _id: "63ee9bacb1477872e853e1d5",
            isSuspended: true,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
    it("Should update employee object: isSuspended => true ", async () => {
      const res = await supertest(app)
        .put("/employee")
        .send({
          update: {
            _id: "63ee9bacb1477872e853e1d5",
            isSuspended: false,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("GET: RETRIEVE EMPLOYEES:", () => {
    it("Should Get all employees", async () => {
      const res = await supertest(app)
        .get("/employee")
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("GET: RETRIEVE ONE EMPLOYEE:", () => {
    // it("Should return _id missing error", async () => {
    //   const res = await supertest(app)
    //     .get("/employee/find-one")
    //     .send({})
    //     .set({ Token: ManagerToken });
    //   expect(res.statusCode).toBe(400);
    //   expect(res.body.type.toLowerCase()).toEqual("error");
    // });
    it("Should return _id missing error", async () => {
      const res = await supertest(app)
        .get("/employee/find-one")
        .set({ Token: ManagerToken, _id: "63ee9bacb1477872e853e1d5" });
      expect(res.body.data).toBeDefined();
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("PUT: CHANGE PASSWORD", () => {
    it("Should update employee object: Password => 123456789 ", async () => {
      const res = await supertest(app)
        .put("/employee/forgot-password")
        .send({
          update: {
            _id: "63ee9bacb1477872e853e1d5",
            Password: "123456789",
          },
        });
      // .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
});
describe("** MANAGER **", () => {
  describe("POST: CREATE MANAGER:", () => {
    it("Should return schema error", async () => {
      const res = await supertest(app).post("/manager").send({
        FirstName: "Manager",
        LastName: "Hesam",
        Email: "sports.centre.2023@gmail.com",
        Password: "12345678",
        // isActive: true,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should return error: Email taken", async () => {
      const res = await supertest(app).post("/manager").send({
        FirstName: "Manager",
        LastName: "Hesam",
        Email: "sports.centre.2023@gmail.com",
        Password: "12345678",
        isActive: true,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    // it("Should create a new manager", async () => {
    //   const res = await supertest(app).post("/manager").send({
    //     FirstName: "Manager",
    //     LastName: "Hesam",
    //     Email: "v3sk@yahoo.com",
    //     Password: "12345678",
    //     isActive: true,
    //   });
    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.type.toLowerCase()).toEqual("success");
    // });
  });
  describe("PUT: Amend manager", () => {
    it("Should return error: no update object", async () => {
      const res = await supertest(app)
        .put("/manager")
        .send({})
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should return schema error: no update object", async () => {
      const res = await supertest(app)
        .put("/manager")
        .send({
          update: {
            // _id: "63eb58feaeccfe9622ad5a9d",
            Email: "sports.centre.2023@gmail.com",
            isActive: true,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should return error: Email Taken", async () => {
      const res = await supertest(app)
        .put("/manager")
        .send({
          update: {
            _id: "63eb58feaeccfe9622ad5a9d",
            Email: "d.3s@yahoo.com",
            // isActive: true,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should amend manager profile: isActive => false", async () => {
      const res = await supertest(app)
        .put("/manager")
        .send({
          update: {
            _id: "63eb58feaeccfe9622ad5a9d",
            Email: "sports.centre.2023@gmail.com",
            isActive: false,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
    it("Should amend manager profile: isActive => true", async () => {
      const res = await supertest(app)
        .put("/manager")
        .send({
          update: {
            _id: "63eb58feaeccfe9622ad5a9d",
            Email: "sports.centre.2023@gmail.com",
            isActive: true,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("PUT: Amend manager password", () => {
    it("Should Return error: no manager object", async () => {
      const res = await supertest(app)
        .put("/manager/change-password")
        .send({})
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should Return schema error: password not valid", async () => {
      const res = await supertest(app)
        .put("/manager/change-password")
        .send({
          manager: {
            _id: "63eb58feaeccfe9622ad5a9d",
            Password: "1234",
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should change password: => 123456789", async () => {
      const res = await supertest(app)
        .put("/manager/change-password")
        .send({
          manager: {
            _id: "63eb58feaeccfe9622ad5a9d",
            Password: "123456789",
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
    it("Should change password: => 12345678", async () => {
      const res = await supertest(app)
        .put("/manager/change-password")
        .send({
          manager: {
            _id: "63eb58feaeccfe9622ad5a9d",
            Password: "Hesam1376!",
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("PUT: Amending sports centre info", () => {
    it("Should return error: no update object", async () => {
      const res = await supertest(app)
        .put("/manager/change-info")
        .send({})
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should return schema error: invalid type", async () => {
      const res = await supertest(app)
        .put("/manager/change-info")
        .send({
          update: {
            Discount: "%15",
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should amend discount price: => %10", async () => {
      const res = await supertest(app)
        .put("/manager/change-info")
        .send({
          update: {
            Discount: 15,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
    it("Should amend discount price: => %15", async () => {
      const res = await supertest(app)
        .put("/manager/change-info")
        .send({
          update: {
            Discount: 15,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
  describe("PUT: Amend facilities", () => {
    it("Should return error: no update object", async () => {
      const res = await supertest(app)
        .put("/swimming-pool/management")
        .send({})
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should return error: invalid attributes", async () => {
      const res = await supertest(app)
        .put("/swimming-pool/management")
        .send({
          update: {
            Capacit: 2,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(400);
      expect(res.body.type.toLowerCase()).toEqual("error");
    });
    it("Should amend pool capacity: => 15", async () => {
      const res = await supertest(app)
        .put("/swimming-pool/management")
        .send({
          update: {
            Capacity: 15,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
    it("Should amend pool capacity: => 30", async () => {
      const res = await supertest(app)
        .put("/swimming-pool/management")
        .send({
          update: {
            Capacity: 30,
          },
        })
        .set({ Token: ManagerToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.type.toLowerCase()).toEqual("success");
    });
  });
});

// write a test for employee login
