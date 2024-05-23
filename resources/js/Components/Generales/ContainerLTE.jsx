import React from "react";

const ContainerLTE = React.memo(({children,title,buttonadd}) => {
    return (
        <div className="col-md-12 mt-2">
            <div className="card card-danger card-outline">
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
