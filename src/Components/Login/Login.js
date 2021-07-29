import React, { useState } from 'react';
import styles from "./Login.module.scss";
import firebase from "../../Firebase";
import "firebase/auth";
import "firebase/database";
import 'bootstrap/dist/css/bootstrap.min.css';

async function loginUser({ email, password }) {
    return firebase
        .auth()
        .signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
}

async function selectUserByUid(response) {
    return firebase.database().ref("user/" + response.uid);
}

function Login({ setUser }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const onSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            email,
            password
        });
        try {
            const ref = await selectUserByUid(response.user);
            ref.on("value", (snapshot) => {
                const user = snapshot.val();
                if (
                    user == null ||
                    (user.position.toLowerCase() != "hr" &&
                        user.position.toLowerCase() != "admin")
                ) {
                    firebase
                        .auth()
                        .signOut()
                        .then((response) => {
                            alert('This user is not Permission');
                        });
                } else {
                    setUser(user);
                }

            });
        } catch (error) {

        }

    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <h3 >Log in</h3>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <button type="submit" className="btn btn-signin btn-lg btn-block ">
                Sign in
            </button>
        </form>
    );
}

export default Login;