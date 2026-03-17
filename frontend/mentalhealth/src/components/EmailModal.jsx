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
                <h3 className="email-title">
                    Email Your Results
                </h3>
                <div className="form-group">
                    <label className="emailLabel" htmlFor="emailAddress">
                        Email Address:
                    </label>
                    <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        id="emailAddress"
                        placeholder="Enter email address"
                    />
                </div>
                <div className="emailGroup">
                    <label
                        htmlFor="emailMessage"
                        className="emailLabel"
                    >
                        Optional Message:
                    </label>
                    <textarea
                        id="emailMessage"
                        rows="4"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Add a personal message..."
                    ></textarea>
                </div>
                <div className="emailButtons">
                    <button
                        id="cancelEmailBtn"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        id="sendEmailBtn"
                        onClick={sendEmail}
                    >
                        Send Email
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailModal;