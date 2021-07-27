import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import styles from "./Checking.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from "../../Firebase";
import "firebase/database";
import moment from "moment";

async function selectAllLocation() {
  return firebase.database().ref("location");
}

function selectUserByID(user_id) {
  return firebase.database().ref("user").child(user_id);
}

function App() {

  const [items, setItems] = useState([]);
  const [fullName, setFullName] = useState();

  const openInNewTab = (url) => {
    const newWindow = window.open(
      "https://www.google.com/maps/search/?api=1&query=" + url,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

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
      const locationRef = await selectAllLocation();
      let newState = [];
      locationRef.once("value").then((snapshot) => {

        let items = snapshot.val();

        for (let item in items) {
          moment().locale("TH");
          const date = moment(items[item].date.toString(), "DD/MM/YYYY");
          date.add(543, "years");
          getFullName(items[item].user_id);
          newState.push({
            fullname: fullName,
            date: date.format("DD/MM/YYYY"),
            lat: items[item].latitude,
            locationId: items[item].location_id,
            long: items[item].longitude,
            photo: items[item].photo,
            status: items[item].status,
            time: items[item].time,
            user_id: items[item].user_id,
            position: items[item].latitude + "," + items[item].longitude,
          });
        }

        newState.map((item, index) => {
          const userRef = selectUserByID(item.user_id);
          userRef.on("value", (snapshot) => {
            let items = snapshot.val();
            if (items != null) {
              item.fullname = items.name + " " + items.surname;
              setFullName(items.name + " " + items.surname);
            }
          });
        });
        setItems(newState);
      });
    }

    listData()
  }, [])

  return (
    <div className={styles.body}>
      <h1>ประวัติการเข้าทำงาน</h1>
      <MaterialTable
        options={{
          headerStyle: { backgroundColor: "grey" },
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
          }
        }}
        columns={[
          { title: "ชื่อ - สกุล", field: "fullname" },
          {
            title: "สถานะ",
            field: "status",
            cellStyle: (data, rowData) => {
              if (rowData.status === "check-in") {
                return { color: "green", fontWeight: "bold" };
              } else {
                return { color: "red", fontWeight: "bold" };
              }
              return {};
            },
          },
          { title: "วันที่", field: "date", type: "date" },
          { title: "เวลา", field: "time", type: "time" },
          {
            title: "ละติจูด,ลองจูด",
            field: "position",
          },
        ]}
        data={items.map((item) => {
          return item;
        })}
        actions={[
          {
            icon: "search",
            tooltip: "search google map",
            onClick: (event, rowData) =>
              openInNewTab(rowData.position),
          },
        ]}
      />
    </div>
  );
}

export default App;
