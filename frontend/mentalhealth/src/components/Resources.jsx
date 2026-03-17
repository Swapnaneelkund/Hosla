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
                                        <img src="/src/assets/logo.png" alt="Hosla" id="desImage"/>
                                    )}
                                    {resource.title}
                                </div>

                                <div className="resource-description">
                                    {resource.description}
                                </div>
                            </div>

                            <i className="fas fa-chevron-right"></i>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Resources;