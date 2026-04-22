import React from "react";
import AppHeader from "./_components/AppHeader";

function DashboardProvider({ children } : any ){
    return (
        <div className="w-full">
            <AppHeader/>
            { children }
        </div>
    )
}

export default DashboardProvider;