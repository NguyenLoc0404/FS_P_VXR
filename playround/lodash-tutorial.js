const _ = require("lodash");

const person_1 = {
  name: "Nguyen Van A",
  job: {
    title: "student",
    university: {
      name: "DH BK",
      major: "CNTT"
    }
  }
}

const person_2 = {
  name: "Le Quang Song",
  job: {
    title: "business man",
    offices: [
      {
        name: "VP quan 10",
        address: "QUan 10"
      },
      {
        name: "VP quan BT",
        address: "QUan BT"
      },
      {
        name: "VP quan 3",
        address: "QUan 3"
      }
    ]
  }
}

const persons = [person_1, person_2]

// 1. _.get
persons.forEach(p => {
  // const print = p.job && p.job.university && p.job.university.major
  // console.log(print)
                                                //undefined cho gia tri
  console.log(_.get(p, "job.university.major", "Khong co major"))
})

// 2. _.set                             //set gia tri cho truong do
_.set(person_2, "job.university.major", "AI")
console.log(person_2)