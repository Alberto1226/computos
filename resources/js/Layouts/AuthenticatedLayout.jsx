import react, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import Header from './Sections/Header';
import Menu from './Sections/Menu';
import Footer from './Sections/Footer';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="wrapper">
        {/**header {auth && auth.user && auth.user.name && <Header name={auth.user.name} />}                   */}
        {/* Verificar si el usuario está autenticado y pasar el ID del usuario al componente Header */}
        {/* {auth && auth.user && auth.user.id && <Header userId={auth.user.id} />} */}
        <Header/>
        <Menu/>
        <div className="content-wrapper">
            {children}
        </div>
        <Footer />
    </div>
    );
}
