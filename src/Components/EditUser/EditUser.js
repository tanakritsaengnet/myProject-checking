import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import firebase from '../../Firebase';
import "firebase/database";
import 'firebase/storage'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./EditUser.module.scss";
import ImageUploader from 'react-images-upload';
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { useHistory } from "react-router-dom";
import icon from "../List/image/iconfinder.png";

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

function App({ rowData }) {
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState(genders[0].name);
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [position, setPosition] = useState(positions[0].name);
    const [password, setPassword] = useState('');
    const [surname, setSurname] = useState('');
    const [tel, setTel] = useState('');
    let { id } = useParams();
    const [disable, setDisable] = useState(true);
    const history = useHistory();
    const [updatePhoto, setUpdatePhoto] = useState(false);
    const [oldPhoto, setOldPhoto] = useState(icon);

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
            if (updatePhoto == true) {
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
                            firebase.database().ref('user/' + id).set({
                                email: email,
                                gender: gender,
                                name: name,
                                photo: downloadURL,
                                password: password,
                                position: position,
                                surname: surname,
                                tel: tel,
                                user_id: id
                            });
                        })
                    }
                );
            } else {
                firebase.database().ref('user/' + id).set({
                    email: email,
                    gender: gender,
                    name: name,
                    photo: oldPhoto,
                    password: password,
                    position: position,
                    surname: surname,
                    tel: tel,
                    user_id: id
                })
            }
            alert("อัพเดทข้อมูลสำเร็จ");
            history.push("/list");
        } catch (error) {
            alert(error);
        }
    };

    const onDrop = picture => {
        setPhoto(picture[0])
        setUpdatePhoto(true)
    }

    useEffect(() => {
        firebase.database()
            .ref('user/' + id)
            .on('value', snapshot => {
                const user = snapshot.val();
                if (user == null) {
                    alert('User ID: ' + id + " not found.")
                    setDisable(true);
                    history.push("/list");
                } else {
                    setDisable(false);
                    console.log('User data: ', user);
                    setEmail(user.email);
                    setPassword(user.password);
                    setGender(user.gender);
                    setName(user.name);
                    setSurname(user.surname);
                    if (user.photo != null && user.photo != '') {
                        setOldPhoto(user.photo);
                    }
                    setPosition(user.position);
                    setTel(user.tel);
                }
            });

    }, [])

    return (
        < div className={styles.body} >
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <h1>แก้ไขข้อมูลพนักงาน</h1>
                </div >
                <div className="form-row">
                    <label>Profile</label>
                </div>
                <img src={[oldPhoto]} alt="Avatar" width="150" height="150" />
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Email</label>
                        <input
                            value={email}
                            type="email"
                            name="Email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={e => setEmail(e.target.value)}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Password</label>
                        <input
                            value={password}
                            type="password"
                            name="Password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={e => setPassword(e.target.value)}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label>เพศ</label>
                        <DropdownList
                            value={gender}
                            data={genders}
                            dataKey='id'
                            textField='name'
                            onChange={value => setGender(value.name)}
                        />
                    </div>

                    <div className="form-group col-md-5">
                        <label>ชื่อ</label>
                        <input
                            value={name}
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
                            value={surname}
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
                            value={position}
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
                            value={tel}
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

                <button disabled={disable} type="submit" className="btn btn-dark btn-lg btn-block" refresh="true">
                    Save
                </button>

            </form>
        </div >

    )
};

export default App;