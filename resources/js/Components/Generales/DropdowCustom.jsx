import React, { useState, useEffect, useRef } from "react";

const CustomDropdown = ({ title,icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [iconRotation, setIconRotation] = useState(0);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIconRotation(isOpen ? 0 : -90);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIconRotation(0);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIconRotation(0);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <div ref={dropdownRef} className="dropdown">
                <a
                    className="nav-link"
                    href="#"
                    role="button"
                    onClick={toggleDropdown}
                    aria-expanded={isOpen ? "true" : "false"}
                >
                    <span className={icon} />
                    <p>{title}</p>
                    <i
                        className="fas fa-angle-left right"
                        style={{
                            transform: `rotate(${iconRotation}deg)`,
                            transition: "transform 0.3s ease", // Añadir transición suave
                        }}
                    ></i>
                </a>
                <ul
                    className={`dropdown-menu ${isOpen ? "show" : ""}`}
                    style={{ position: "absolute", right: 0, backgroundColor:"black" }}
                >
                    {children}
                </ul>
            </div>
        </div>
    );
};

export default CustomDropdown;
