import React from "react";

const Resources = ({ resourcesData }) => {

    return (
        <div className="results-card">
            <div className="resources-section">
                <h2 className="section-title">
                    <i className="fas fa-hands-helping"></i>
                    Resources & Support
                </h2>
                <div id="resourcesList">
                    {resourcesData.map((resource, idx) => (
                        <div
                            key={idx}
                            className="resource-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                if (resource.url.startsWith("tel:")) {
                                    window.location.href = resource.url;
                                } else {
                                    window.open(resource.url, "_blank");
                                }
                            }}
                        >
                            <div className="resource-icon">
                                <i className={`fas ${resource.icon}`}></i>
                            </div>

                            <div className="resource-content">
                                <div className="resource-title">
                                    {idx === 0 && (
                                        <img
                                            src="/src/assets/logo.png"
                                            alt="Hosla"
                                            style={{
                                                height: "30px",
                                                verticalAlign: "middle",
                                                marginRight: "4px",
                                            }}
                                        />
                                    )}
                                    {resource.title}
                                </div>

                                <div className="resource-description">
                                    {resource.description}
                                </div>
                            </div>

                            <i className="fas fa-chevron-right" style={{ color: "#64748b" }}></i>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Resources;