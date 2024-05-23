import React, { Component } from "react";
import Dropdown from "@/Components/Dropdown";

export default class Header extends Component {
    /*constructor(props) {
        super(props);
        this.name = props.auth.user.name;
        console.log(props.auth.user.name);
    }*/

    constructor(props) {
        super(props);
        this.auth = this.props.auth;
    }


    render() {

       
        return (
            <div>
                <nav
                    className="main-header navbar navbar-expand navbar-white navbar-light text-light"
                   
                >
                    {/* Left navbar links */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                data-widget="pushmenu"
                                href="#"
                            >
                                <i className="fas fa-bars" />
                            </a>
                        </li>
                    </ul>

                    {/* Right navbar links */}
                    <ul className="navbar-nav ml-auto">


                        <li className="nav-item">

                            {/* <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="nav-link text-light"
                            >
                                <i className="nav-icon fas fa-sign-out-alt" />
                                
                            </Dropdown.Link> */}
                            <Dropdown>
                                {/* Contenido del dropdown */}
                                
                                <Dropdown.Content>
                                    {/* Contenido del dropdown */}
                                    <Dropdown.Link href={route("profile.edit")}>
                                        <i className="nav-icon bi bi-person-fill" />
                                        <span> </span> Perfil</Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="nav-link text-red"
                                    >
                                        <i className="nav-icon fas fa-sign-out-alt" />
                                        <span> </span> Cerrar Sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </li>

                    </ul>
                </nav>
            </div>
        );
    }
}