import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import "firebase/database";
import styles from "./List.module.scss";
import MaterialTable from "material-table";
import icon from "./image/iconfinder.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useHistory } from "react-router-dom";

async function selectUser() {
  return firebase.database().ref("user");
}

function List() {

  const [items, setItems] = useState([]);
  const history = useHistory();

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

  const doDelete = (userId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this user?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                firebase.database().ref('user/' + userId).remove();
                firebase.database().ref('leave/' + userId).remove();
                firebase.database().ref('location').orderByChild('user_id').equalTo(userId).remove();
                alert('Delete User ID: ' + userId + " from user complete");
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  }

  const doEdit = (rowData) => {
    history.push("/EditUser/" + rowData.user_id);
  }

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
          actionsColumnIndex: -1
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
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit User',
            onClick: (event, rowData) => doEdit(rowData)
          },
          {
            icon: 'delete',
            tooltip: 'Delete User',
            onClick: (event, rowData) => doDelete(rowData.user_id)
          }
        ]}
      />
    </div>
  );
}

export default List;
