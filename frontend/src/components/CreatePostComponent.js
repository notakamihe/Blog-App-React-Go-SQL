import React, {useState} from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import {useHistory} from 'react-router-dom'

export default function CreatePostComponent() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    let history = useHistory()

    const postPost = (e) => {
        e.preventDefault()

        axios.post(axios.defaults.baseURL + "posts", {
            author_id: JSON.parse(localStorage.getItem("user")).id.toString(),
            title: title,
            content: content
        }).then(res => {
            setTitle([])
            setContent([])
            history.push(`/profiles/${JSON.parse(localStorage.getItem("user")).id}`)
        }).catch(err => {
            if (err.response)
                console.log(err.response.data);
        })
    }

    if (localStorage.getItem("user") == null)
        history.push("/login")

    return (
        <div>
            <div style={{width: "70%", margin: "auto", marginTop: 64, marginBottom: 72}}>
                <h1 style={{textAlign: "center", marginBottom: 64}}>Post to the world</h1>
                <Form onSubmit={postPost}>
                    <Form.Group>
                        <Form.Control 
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                            required={true}
                            placeholder="Title here"
                            style={{
                                fontSize: 36,
                                border: "none"
                            }}
                        />
                    </Form.Group>
                    <hr style={{marginBottom: 64}} />
                    <Form.Group>
                        <TextareaAutosize 
                            style={{
                                width: "100%",
                                outline: "none",
                                padding: 16
                            }}
                            onChange={e => setContent(e.target.value)}
                            value={content}
                            required={true}
                            placeholder="Enter the meat of your article here."
                        />
                    </Form.Group>
                    <Button type="submit">Create</Button>
                </Form>
            </div>
        </div>
    )
}
