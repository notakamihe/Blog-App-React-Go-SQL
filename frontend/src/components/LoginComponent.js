import React, {useState} from 'react'
import axios from 'axios'
import {Form, Button, Alert} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

export default function LoginComponent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errors, setErrors] = useState([])

    let history = useHistory()

    const logIn = (e) => {
        e.preventDefault()
        setErrors([])

        axios.post(axios.defaults.baseURL + "login", {
            email: email,
            password: password
        }).then(res => {
            localStorage.setItem("user", JSON.stringify(res.data))
            history.push(`/profiles/${res.data.id}`)
            window.location.reload()
        }).catch(err => {
            setErrors(errors => [...errors, err.response.data])
            console.log(err.response.data)
        })
    }

    const renderErrors = () => {
        if (errors) {
            return (
                errors.map((err, idx) => 
                    <Alert key={idx} variant="danger">
                        {err}
                    </Alert>
                )
            )
        } else {
            return null
        }
    }

    if (localStorage.getItem("user") != null)
        history.push(`/profiles/${JSON.parse(localStorage.getItem("user")).id}`)

    return (
        <div>
            {renderErrors()}
           <Form style={{width: "60%", margin: "auto", marginTop: 96}} onSubmit={logIn}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        required={true}
                    />
                </Form.Group>
                <Form.Group className="pb-5" style={{width: "65%"}}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        required={true}
                    />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                    Log in
                </Button>
            </Form>
        </div>
    )
}
