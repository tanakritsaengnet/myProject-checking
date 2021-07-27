import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";
import styles from "./Leave.module.scss";
import firebase from "../../Firebase";
import "firebase/database";

import moment from "moment";

async function selectAllLeave() {
  return firebase.database().ref("leave");
}

function selectUserByID(user_id) {
  return firebase.database().ref("user").child(user_id);
}

function App() {
  const [datas, setDatas] = useState([]);
  const [fullName, setFullName] = useState();

  function getFullName(user_id) {
    const userRef = selectUserByID(user_id);
    userRef.on("value", (snapshot) => {
      let items = snapshot.val();
      if (items != null) {
        setFullName(items.name + " " + items.surname);
      }
    });
  }


  useEffect(() => {
    async function listData() {
      const leaveRef = await selectAllLeave();
      await leaveRef.once("value").then((snapshot) => {
        let array = [];
        snapshot.forEach((el) => {
          const list = el.val();
          for (const index in list) {
            moment().locale("TH");
            const date = moment(list[index].date.toString(), "DD/MM/YYYY");
            date.add(543, "years");

            getFullName(list[index].user_id);

            array.push({
              fullname: fullName,
              date: date.format("DD/MM/YYYY"),
              comment: list[index].comment,
              leave: list[index].leave,
              time: list[index].time,
              user_id: list[index].user_id,
            });
          }
        });

        array.map((users, index) => {
          const dbRef = selectUserByID(users.user_id);
          let data = dbRef
            .once("value")
            .then((snapshot) => {
              let user = snapshot.val();
              users.fullname = user.name + " " + user.surname;
              setFullName(user.name + " " + user.surname);
            });
        });
        setDatas(array)
      });
    }

    listData()
  }, [])



  return (
    <div className={styles.body}>
      <h1>ประวัติการลาของพนักงาน</h1>
      <MaterialTable
        options={{
          showTitle: false,
          emptyRowsWhenPaging: true,
          pageSizeOptions: [5, 10],
          rowStyle: {
            fontFamily: ["Prompt", "sans-serif"],
          },
          headerStyle: {
            fontFamily: ["Prompt", "sans-serif"],
          },
          exportButton: true,
          headerStyle: {
            backgroundColor: "#555555",
            color: "#FFF",
          },
        }}
        columns={[
          { title: "ชื่อ-นามสกุล", field: "fullname" },
          { title: "วันที่ลา", field: "date", type: "date" },
          { title: "ประเภท  ", field: "leave" },
          { title: "หมายเหตุ", field: "comment" },
        ]}
        data={datas}
      />
    </div>
  );

}

export default App;
