import React, { Component, useState } from "react";

import Dropdown from "@/Components/Dropdown";

export default class Menu extends Component {
    /*
    constructor(props) {
        super(props);
        this.state = {
            subMenuOpen: false,
            rotationAngle: 0,
            rol: this.props.auth?.user?.roles[0].name || '',
        };
    }

    

    handleDropdownChange = (isOpen) => {
        if (!isOpen) {
            this.resetIconRotation();
        }
    };

    toggleSubMenu1 = () => {
        this.setState((prevState) => ({
            subMenuOpen: !prevState.subMenuOpen,
            rotationAngle: prevState.subMenuOpen ? 0 : 60,
        }));
    };

    resetIconRotation = () => {
        if (this.state.subMenuOpen) {
            this.setState({
                subMenuOpen: false,
                rotationAngle: 0,
            });
        }
    };*/
    render() {
        //console.log("Este es el state", this.state);
        
        const mystylelogo = {
            backgroundColor: " rgb(187 170 172)",
            color: "rgb(255, 255, 255)",
            borderBottom: "0 solid transparent",
            display: "block",
        };

        return (
            <div>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    {/* Brand Logo */}
                    <a
                        href="index3.html"
                        className="brand-link"
                        style={mystylelogo}
                    >
                        <span className="brand-text font-weight-light">
                            Control de Gastos
                        </span>
                    </a>
                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Sidebar Menu */}
                        <nav className="mt-2">
                            <ul
                                className="nav nav-pills nav-sidebar flex-column"
                                data-widget="treeview"
                                role="menu"
                                data-accordion="false"
                            >
                                
                                    <li className="nav-item">
                                        <a
                                            href={route("dashboard")}
                                            className="nav-link"
                                        >
                                            <i className="nav-icon fas fa-th" />
                                            <p>Dashboard</p>
                                        </a>
                                    </li>
                               

                                <li className="nav-item">
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="nav-link"
                                    >
                                        <i className="nav-icon fas fa-sign-out-alt" />
                                        Cerrar Sesión
                                    </Dropdown.Link>
                                </li>
                            </ul>
                        </nav>
                        {/* /.sidebar-menu */}
                    </div>
                    {/* /.sidebar */}
                </aside>
            </div>
        );
    }
}
