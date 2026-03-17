import React from "react";

const EmailModal = ({
    showEmailModal,
    closeModal,
    emailAddress,
    setEmailAddress,
    emailMessage,
    setEmailMessage,
    sendEmail
}) => {

    if (!showEmailModal) return null;

    return (
        <div id="emailModal" className="modal">
            <div className="modal-content">
                <span id="closeModalSpanBtn" className="close" onClick={closeModal}>
                    &times;
                </span>
                <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                    Email Your Results
                </h3>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="emailAddress" style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}>
                        Email Address:
                    </label>
                    <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        id="emailAddress"
                        placeholder="Enter email address"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "16px"
                        }}
                    />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label
                        htmlFor="emailMessage"
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 600,
                            color: "#374151"
                        }}
                    >
                        Optional Message:
                    </label>
                    <textarea
                        id="emailMessage"
                        rows="4"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "16px",
                            resize: "vertical"
                        }}
                    ></textarea>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                        id="cancelEmailBtn"
                        onClick={closeModal}
                        style={{
                            padding: "12px 24px",
                            background: "#e2e8f0",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            color: "#374151"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        id="sendEmailBtn"
                        onClick={sendEmail}
                        style={{
                            padding: "12px 24px",
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600
                        }}
                    >
                        Send Email
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailModal;