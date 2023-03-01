import React from "react";
import "../styles.css";

const Layout = ({title = "title", description = "description", className, children}) => {   // {} is for destructuring
    return (
        <div>
            <div className="jumbotron">
                <h1>{title}</h1>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>
                {children}
            </div>
        </div>
    )
}
export default Layout;