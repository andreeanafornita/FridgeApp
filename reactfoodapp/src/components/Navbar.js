import {Link,useLocation} from "react-router-dom"
import { useState } from "react"
import SideBar from "./SideBar";
import logo from "./logo/logo.png";
import {faReceipt,faToiletPortable,faBowlFood,faBullseye,faUser,faGear,faJournalWhills} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar(){
    const [showSideBar,setShowSideBar]=useState(false);
    const location=useLocation()
    const links = [
        {
            name:"Products",
            path:"/myfridge",
            icon:faReceipt
        },
        {
            name:"Review",
            path:"/reviewForm",
            icon:faJournalWhills
        },
        {
            name:"Make a meal",
            path:"/makeameal",
            icon:faBowlFood
        },
        {
            name:"Targets",
            path:"/targets",
            icon:faBullseye
        },
        {
            name:"Profile",
            path:"/profile",
            icon:faUser
        },
        {
            name:"Settings",
            path:"/settings",
            icon:faGear
        }
    ]
    function closeSideBar(){
        setShowSideBar(false);
    }
    return(
       <>
        <div className="navbar container">
        <Link to="/" className="logo">
               <img src={logo} alt="FridgeFest Logo"/>
               
                <span>Fridge</span>Fest</Link>
            <div className="nav-links">
            {links.map(link => (
                        <Link 
                            className={location.pathname === link.path ? "active nav-item" : "nav-item"} 
                            to={link.path} 
                            key={link.name}
                        >
                            <FontAwesomeIcon icon={link.icon} className="nav-icon" />
                            {link.name}
                        </Link>
                    ))}
                
            </div>
            <div onClick={showSideBar ? closeSideBar : () => setShowSideBar(true)} className="sidebar-btn">
  <div className={`bar ${showSideBar ? 'active' : ''}`}></div>
  <div className={`bar ${showSideBar ? 'active' : ''}`}></div>
  <div className={`bar ${showSideBar ? 'active' : ''}`}></div>
</div>

        </div>
        {showSideBar && <SideBar close= {closeSideBar} links={links}/>}
    
       </>
    )
}