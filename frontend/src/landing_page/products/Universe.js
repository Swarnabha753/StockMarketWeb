import React from "react";

const partners = [
    {
        name: "Smallcase",
        logo: "media/images/smallcaseLogo.png",
        description: "Thematic investment platform",
    },
    {
        name: "Streak",
        logo: "media/images/streakLogo.png",
        description: "Algo & strategy platform",
    },
    {
        name: "Sensibull",
        logo: "media/images/sensibullLogo.svg",
        description: "Options trading platform",
    },
    {
        name: "Zerodha Fund House",
        logo: "media/images/zerodhaFundhouse.png",
        description: "Asset management",
    },
    {
        name: "GoldenPi",
        logo: "media/images/goldenpiLogo.png",
        description: "Bonds trading platform",
    },
    {
        name: "Ditto",
        logo: "media/images/dittoLogo.png",
        description: "Insurance",
    },
];

function Universe() {
    return (
        <div className="container mt-5">
            <div className="row text-center">

                {/* Heading */}
                <h1 style={styles.heading}>The Zerodha Universe</h1>
                <p style={styles.subHeading}>
                    Extend your trading and investment experience even further with our partner platforms
                </p>

                {/* Partner Logos */}
                {partners.map((partner, index) => (
                    <div
                        key={index}
                        className="col-12 col-md-4 p-4 d-flex flex-column align-items-center"
                    >
                        <div style={styles.logoWrapper}>
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                style={styles.logo}
                            />
                        </div>
                        <p style={styles.description}>
                            {partner.description}
                        </p>
                    </div>
                ))}

                {/* CTA Button */}
                <div className="col-12">
                    <button style={styles.button}>
                        Signup Now
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Universe;

const styles = {
    heading: {
        fontSize: "2.5rem",
        fontWeight: "600",
        marginBottom: "8px",
    },
    subHeading: {
        color: "#6c757d",
        marginBottom: "32px",
        fontSize: "1rem",
    },
    logoWrapper: {
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
    },
    logo: {
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain",
    },
    description: {
        fontSize: "0.9rem",
        color: "#6c757d",
        textAlign: "center",
    },
    button: {
        padding: "12px 40px",
        fontSize: "18px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#387ed1",
        color: "#fff",
        cursor: "pointer",
        marginTop: "20px",
    },
};
