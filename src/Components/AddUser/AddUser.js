import React, { useState, useEffect } from "react";
import firebase from '../../Firebase';
import "firebase/database";
import 'firebase/storage'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./AddUser.module.scss";
import ImageUploader from 'react-images-upload';
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";

let genders = [
    { id: 0, name: 'ไม่ระบุ' },
    { id: 1, name: 'ชาย' },
    { id: 2, name: 'หญิง' },
];

let positions = [
    { id: 0, name: 'HR' },
    { id: 1, name: 'PM' },
    { id: 2, name: 'GF' },
    { id: 3, name: 'PD' },
    { id: 4, name: 'GM' },
    { id: 5, name: 'QC' },
];

function App({ user }) {
    const [email, setEmail] = useState();
    const [gender, setGender] = useState(genders[0].name);
    const [name, setName] = useState();
    const [photo, setPhoto] = useState();
    const [position, setPosition] = useState(positions[0].name);
    const [password, setPassword] = useState();
    const [surname, setSurname] = useState();
    const [tel, setTel] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(email, gender, name, photo, position, password, surname, tel)
        if (email == null || password == null) {
            alert("ไม่ได้ระบุข้อมูล email หรือ password")
            return;
        } else if (gender == undefined) {
            alert("ไม่ได้ระบุข้อมูลเพศ")
            return;
        } else if (position == undefined) {
            alert("ไม่ได้ระบุข้อมูลตำแหน่งงาน")
            return;
        } else if (photo == undefined) {
            alert("ไม่ได้ระบุข้อมูลรูปภาพ")
            return;
        }
        try {
            const currentUser = user;
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                throw error
            });

            if (response != null) {
                const user = response.user;
                try {
                    var metadata = {
                        contentType: 'image/jpeg'
                    };
                    var uploadTask = firebase.storage().ref('images').child(photo.name).put(photo, metadata);
                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            alert(error);
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                firebase.database().ref("user").child(user.uid).set({
                                    email: email,
                                    gender: gender,
                                    name: name,
                                    photo: downloadURL,
                                    password: password,
                                    position: position,
                                    surname: surname,
                                    tel: tel,
                                    user_id: user.uid
                                });
                                firebase.auth().signOut().then(() => {
                                    firebase.auth().signInWithEmailAndPassword(currentUser.email, currentUser.password.toString());
                                    alert("เพิ่มพนักงานสำเร็จ");
                                }).catch((error) => {
                                    console.log(error);
                                    alert(error);
                                    throw error
                                });
                            })
                        }
                    );
                } catch (error) {
                    throw error
                }
            }

        } catch (error) {
            alert(error);
        }
    };

    const onDrop = picture => {
        setPhoto(picture[0])
    }
    
    return (
        < div className={styles.body} >
            <form onSubmit={handleSubmit}>
                <h1>เพิ่มพนักงาน</h1>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Email</label>
                        <input
                            type="email"
                            name="Email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Password</label>
                        <input
                            type="password"
                            name="Password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label>เพศ</label>
                        <DropdownList
                            defaultValue={0}
                            data={genders}
                            dataKey='id'
                            textField='name'
                            onChange={value => setGender(value.name)}
                        />
                    </div>

                    <div className="form-group col-md-5">
                        <label>ชื่อ</label>
                        <input
                            type="text"
                            name="Name"
                            className="form-control"
                            placeholder="Enter Name"
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group col-md-5">
                        <label>นามสกุล</label>
                        <input
                            type="text"
                            name="Surname"
                            className="form-control"
                            placeholder="Enter Surname"
                            onChange={e => setSurname(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label>ตำแหน่ง</label>
                        <DropdownList
                            defaultValue={0}
                            data={positions}
                            dataKey='id'
                            textField='name'
                            onChange={value => setPosition(value.name)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label>Tel.</label>
                        <input
                            type="text"
                            name="Tel"
                            className="form-control"
                            placeholder="Enter Tel"
                            onChange={e => setTel(e.target.value)}
                        />
                    </div>
                    <div className="form-group col-md-4">
                    </div>
                    <div className="form-group col-md-4">
                        <label>Upload Profile</label>
                        <ImageUploader
                            defaultImages={['https://firebasestorage.googleapis.com/v0/b/checking-test-3e642.appspot.com/o/images%2F202279435_1860905964080224_4748101558635159204_n.jpg?alt=media&token=9abe6775-8af9-412d-ae66-79da13ce47f5']}
                            withPreview={true}
                            withIcon={true}
                            buttonText='Choose images'
                            onChange={onDrop}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={5242880}
                            singleImage={true}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block" refresh="true">
                    Save
                </button>

            </form>
        </div >

    )
};

export default App;