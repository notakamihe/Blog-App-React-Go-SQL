import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Clamp from 'react-multiline-clamp';
import { useHistory } from "react-router-dom";
import { formatDate } from "../utils";
import {Button} from 'react-bootstrap'

export default function UserDetailComponent(props) {
    const [userBeingViewed, setUserBeingViewed] = useState({})
    const [associatedPosts, setAssociatedPosts] = useState([])

    const [deleteMode, setDeleteMode] = useState(false)

    let history = useHistory()

    useEffect(() => {
        axios.get(axios.defaults.baseURL + `profiles/${props.id}`).then(res => {
            setUserBeingViewed(res.data);

            axios.get(axios.defaults.baseURL + `posts`).then(r => {
                setAssociatedPosts(r.data.filter(post => post.authorid == res.data.id));
            })
        }).catch(err => {
            history.push("/")
        })
    }, [])

    const deleteProfile = () => {
        axios.delete(axios.defaults.baseURL + `profiles/${JSON.parse(localStorage.getItem("user")).id}`).then(res => {
            localStorage.removeItem("user")
            history.push("/")
        }).catch(err => {
            console.log(err);
        })
    }

    const renderDeleteBtn = () => {
        if (localStorage.getItem("user") && userBeingViewed.id == JSON.parse(localStorage.getItem("user")).id) {
            if (deleteMode) {
                return (
                    <Button variant="success" onMouseOut={() => setDeleteMode(false)} onClick={deleteProfile}>Confim</Button>
                )
            } else {
                return (
                    <Button variant="danger" onClick={() => setDeleteMode(true)}>Delete</Button>
                )
            }
        } else {
            return null
        }
    }

    return (
        <div>
            <div style={{display: "flex", width: "80%", margin: "auto", marginTop: 64}}>
                <div style={{flex: 0.3, marginRight: 64}}>
                    <h3 style={{marginBottom: 32}}>{userBeingViewed.name}</h3>
                    {renderDeleteBtn()}
                    <hr />
                    <p>
                    {userBeingViewed.description}
                    </p>
                </div>
                <div style={{flex: 0.7}}>
                    <div>
                        <h2>Posts</h2>
                        <hr />
                        {
                            associatedPosts.map((item, index) => 
                                <a href={`/posts/${item.id}`} style={{textDecoration: "none", color: "black"}}>
                                    <h3>{item.title}</h3>
                                    <p>{formatDate(item.createdat)}</p>
                                    <Clamp withTooltip lines={4}>
                                        <p>
                                        {item.content}
                                        </p>
                                    </Clamp>
                                </a>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
