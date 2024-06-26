import React from "react";

const ContainerLTE = React.memo(({children,title,buttonadd}) => {
    return (
        <div className="col-md-12 mt-2 shadow-sm sm:rounded-lg">
            <div className="card card-dark card-outline">
                <div className="card-header">
                    <h3 className="card-title">
                        {title}
                    </h3>
                    <span className="float-end">{buttonadd}</span>
                </div>
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
});

export default ContainerLTE;
