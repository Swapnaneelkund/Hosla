const UserForm = ({
    submitForm,
    handleRadioChange,
    selectedAnswers,
    translate
}) => {
    return (
        <div id="form-container">
            <form id="userForm" onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        {translate("name")}
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-input"
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        {translate("email")}
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-input"
                        placeholder="Enter your email address"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">{translate("gender")}</label>
                    <div className="radio-group">
                        <label className={`radio-option ${selectedAnswers.gender === "male" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                onChange={handleRadioChange}
                                required
                            />
                            <span>{translate("male")}</span>
                        </label>
                        <label className={`radio-option ${selectedAnswers.gender === "female" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                onChange={handleRadioChange}
                            />
                            <span>{translate("female")}</span>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="address" className="form-label">
                        {translate("address")}
                    </label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        className="form-input"
                        placeholder="Enter your address"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="number" className="form-label">
                        {translate("phone")}
                    </label>
                    <input
                        type="tel"
                        name="number"
                        id="number"
                        className="form-input"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ageSlab" className="form-label">
                        {translate("ageRange")}
                    </label>
                    <select
                        name="ageSlab"
                        id="ageSlab"
                        className="form-input"
                        required
                    >
                        <option value="">{translate("selectAge")}</option>
                        <option value="50-59">50–59</option>
                        <option value="60-69">60–69</option>
                        <option value="70-79">70–79</option>
                        <option value="80-89">80–89</option>
                        <option value="90-99">90–99</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">
                    {translate("submit")}
                    <i className="fas fa-arrow-right"></i>
                </button>
            </form>
        </div>
    );
};

export default UserForm;