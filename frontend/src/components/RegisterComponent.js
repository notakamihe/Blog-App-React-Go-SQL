import React, {useState} from 'react'
import axios from 'axios'
import {Form, Button, Alert} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

export default function RegisterComponent() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [errors, setErrors] = useState([])

    let history = useHistory()

    const register = (e) => {
        e.preventDefault()
        setErrors([])

        if (password != passwordConfirm) {
            setErrors(errors => [...errors, "Passwords don't match"])
            return
        }

        axios.post(axios.defaults.baseURL + "signup", {
            email: email,
            name: name,
            password: password,
            description: description,
        }).then(res => {
            localStorage.setItem("user", JSON.stringify(res.data))
            history.push(`/profiles/${res.data.id}`)
            window.location.reload()
        }).catch(err => {
            setErrors(errors => [...errors, err.response.data])
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
            <Form style={{width: "60%", margin: "auto", marginTop: 64}} onSubmit={register}>
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
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter name"
                        onChange={e => setName(e.target.value)}
                        value={name} 
                        required={true}
                    />
                </Form.Group>

                <Form.Group style={{display: "flex", justifyContent: "center"}}>
                    <Form.Group controlId="formBasicPassword" style={{width: "45%", margin: "0px 32px"}}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group style={{width: "45%", margin: "0px 32px"}}>
                        <Form.Label>Password confirm</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password confirm"
                            onChange={e => setPasswordConfirm(e.target.value)}
                            value={passwordConfirm} 
                            required={true}
                        />
                    </Form.Group>
                </Form.Group>

                <Form.Group className="pb-5">
                    <Form.Label>Description (optional)</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        placeholder="Your description here" 
                        rows={5}
                        onChange={e => setDescription(e.target.value)}
                        value={description} 
                    />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </div>
    )
}
