import React, {useState, useEffect,} from 'react'
import axios from 'axios'
import {Button, Form} from 'react-bootstrap'
import { formatDateFull } from "../utils";
import { useHistory } from "react-router-dom";

export default function PostDetailComponent(props) {
    const [post, setPost] = useState({})
    const [name, setName] = useState('')
    const [likes, setLikes] = useState([])
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
    const [likeId, setLikeId] = useState(-1)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [editMode, setEditMode] = useState(false)

    let history = useHistory()

    useEffect(() => {
        getPost()
    }, [])

    console.log(likeId);

    const deletePost = () => {
        if (window.confirm("Delete this post?")) {
            axios.delete(axios.defaults.baseURL + `posts/${props.id}`).then(res => {
                history.push(`/profiles/${user.id}`)
            }).catch(err => console.log(err))
        }
    }

    const getPost = () => {
        axios.get(axios.defaults.baseURL + `posts/${props.id}`).then(res => {
            setPost(res.data);
            setTitle(res.data.title)
            setContent(res.data.content)

            axios.get(axios.defaults.baseURL + `profiles/${res.data.authorid}`).then(r => {
                setName(r.data.name)
            })

            axios.get(axios.defaults.baseURL + "likes").then(r => {
                setLikes(r.data.filter(like => like.postid == res.data.id))

                if (r.data.find(like => like.postid == res.data.id && like.authorid == user.id))
                    setLikeId(r.data.find(like => like.postid == res.data.id && like.authorid == user.id).id)
                else
                    setLikeId(-1)
            }).catch(err => console.log(err))
        }).catch(err => {
            history.push("/")
        })
    }

    const like = () => {
        axios.post(axios.defaults.baseURL + "likes", {
            postid: post.id.toString(),
            authorid: user.id.toString()
        }).then(res => {
            getPost()
        }).catch(err => console.log(err.response.data))
    }

    const renderPost = () => {
        if (editMode) {
            return null
        } else {
            return (
                <div style={{width: "70%", margin: "auto", marginTop: 64}}>
                    <h1>{post.title}</h1>
                    <p><a href={`/profiles/${post.authorid}`}>{name}</a></p>
                    <small>{formatDateFull(post.createdat)}</small>
                    <hr />
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1, textAlign: "center"}}>
                            <h6>{likes.length} likes</h6>
                            {renderPostButtons()}
                        </div>
                        <div style={{flex: 8}}>
                        {post.content}
                        </div>
                    </div>
                </div>
            )
        }
    }

    const renderEditPostForm = () => {
        if (editMode) {
            return (
                <Form style={{width: "70%", margin: "64px auto"}} onSubmit={updatePost}>
                    <Form.Group>
                        <Form.Control 
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                            required={true}
                            style={{
                                fontSize: 36,
                                color: "black",
                                fontWeight: 600
                            }}
                        />
                    </Form.Group>
                    <p><a href={`/profiles/${post.authorid}`}>{name}</a></p>
                    <small>{formatDateFull(post.createdat)}</small>
                    <hr />
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1, textAlign: "center"}}>
                            <h6>133 Likes</h6>
                            <Button variant="success" style={{margin: "8px 0"}} type="submit">Confirm</Button>
                            <Button variant="dark" style={{margin: "8px 0"}} onClick={() => setEditMode(false)}>Cancel</Button>
                        </div>
                        <Form.Group style={{flex: 8}}>
                            <Form.Control 
                                onChange={e => setContent(e.target.value)}
                                value={content}
                                required={true}
                                as="textarea"
                                style={{
                                    color: "black",
                                    height: "150%"
                                }}
                            />
                        </Form.Group>
                    </div>
                </Form>
            )
        } else {
            return null
        }
    }

    const renderPostButtons = () => {
        if (user == null)
            return null
        else if (post.authorid == user.id) {
            return (
                <div>
                    <Button variant="primary" style={{margin: "8px 0"}} onClick={() => setEditMode(true)}>Edit</Button>
                    <Button variant="danger" style={{margin: "8px 0"}} onClick={deletePost}>Delete</Button>
                </div>
            )
        } else {
            if (likeId != -1) {
                return (
                    <Button variant="light" style={{margin: "8px 0"}} onClick={unlike}>Liked</Button>
                )
            } else {
                return (
                    <Button variant="success" style={{margin: "8px 0"}} onClick={like}>Like</Button>
                )
            }
        }
    }

    const updatePost = (e) => {
        e.preventDefault()

        axios.put(axios.defaults.baseURL + `posts/${props.id}`, {
            title: title,
            content: content
        }).then(res => {
            setEditMode(false)
            getPost()
        }).catch(err => {
            console.log(err.response.data);
        })
    }

    const unlike = () => {
        axios.delete(axios.defaults.baseURL + `likes/${likeId}`).then(res => {
            getPost()
        }).catch(err => console.log(err))
    }

    return (
        <div>
            {renderPost()}
            {renderEditPostForm()}
        </div>
    )
}
