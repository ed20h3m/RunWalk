const Activities = [
  "general use",
  "lane swimming",
  "lessons",
  "team events",
  "1-hour sessions",
  "exercise classes",
];
const Facilities = [
  {
    Name: "swimming pool",
    Capacity: 30,
    Activities: ["general use", "lane swimming", "lessons", "team events"],
  },
  {
    Name: "fitness room",
    Capacity: 45,
    Activities: ["general use"],
  },
  {
    Name: "squash court1",
    Capacity: 4,
    Activities: ["1-hour sessions"],
  },
  {
    Name: "squash court2",
    Capacity: 4,
    Activities: ["1-hour sessions"],
  },
  {
    Name: "sports hall",
    Capacity: 40,
    Activities: ["1-hour sessions", "team events"],
  },
  {
    Name: "climbing wall",
    Capacity: 30,
    Activities: ["general use"],
  },
  {
    Name: "studio",
    Capacity: 25,
    Activities: ["exercise classes"],
  },
];

module.exports = { Activities, Facilities };
