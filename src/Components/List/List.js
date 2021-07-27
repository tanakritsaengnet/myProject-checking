import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import "firebase/database";
import styles from "./List.module.scss";
import MaterialTable from "material-table";
import icon from "./image/iconfinder.png";
import 'bootstrap/dist/css/bootstrap.min.css';

async function selectUser() {
  return firebase.database().ref("user");
}

function List() {

  const [items, setItems] = useState([]);

  const listData = async () => {
    const itemsRef = await selectUser();
    itemsRef.on("value", (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      let image = "";
      for (let item in items) {
        image = items[item].photo;
        if (image == null || image == "") {
          image = icon;
        }
        newState.push({
          email: items[item].email,
          gender: items[item].gender,
          name: items[item].name,
          password: items[item].password,
          photo: image,
          position: items[item].position,
          surname: items[item].surname,
          tel: items[item].tel,
          user_id: items[item].user_id,
          fullname: items[item].name + " " + items[item].surname,
        });
      }
      setItems(newState);
    });
  }

  useEffect(() => {
    listData()
  }, [])

  return (
    <div className={styles.body}>
      <h1>รายชื่อพนักงาน</h1>
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
          {
            field: "photo",
            title: "รูปโปรไฟล์",
            render: (rowData) => (
              <img
                src={rowData.photo}
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            ),
          },
          { width: 35, title: "อีเมล", field: "email" },
          { width: 35, title: "ชื่อ-สกุล", field: "fullname" },
          { width: 10, title: "ตำแหน่ง  ", field: "position" },
        ]}
        data={items}
      />
    </div>
  );
}

export default List;
