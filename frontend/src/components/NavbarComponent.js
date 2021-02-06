import React from 'react'
import {Navbar, Nav, Button} from 'react-bootstrap'

const logOut = () => {
    localStorage.removeItem("user")
    window.location = window.location.origin + "/login"
}

const renderRegisterLoginOrLogout = () => {
    if (localStorage.getItem("user")) {
        return (
            <div style={{display: "flex"}}>
                <Button variant="link" onClick={logOut}>Logout</Button>
                <Nav.Link href={`/profiles/${JSON.parse(localStorage.getItem("user")).id}`}>Profile</Nav.Link>
                <Nav.Link href="/create">Create</Nav.Link>
            </div>
            
        )
    } else {
        return (
            <div style={{display: "flex"}}>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
            </div>
        )
    }
}

export default function NavbarComponent() {
    return (
        <Navbar bg="dark" variant="dark" sticky="top">
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav className="mr-auto">
                {renderRegisterLoginOrLogout()}
            </Nav>
        </Navbar>
    )
}
