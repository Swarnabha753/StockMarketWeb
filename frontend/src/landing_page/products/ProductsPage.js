import React from "react";

import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";


function ProductsPage() {
    return (
        <>
            <Hero />
            <LeftSection
                imageURL="media/images/kite.png"
                productName="Kite"
                productDesription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
                tryDemo=""
                learnMore=""
                googlePlay=""
                appStore=""
            />
            <RightSection
                imageURL="media/images/console.png"
                productName="Console"
                productDesription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
                learnMore=""
            />
            <LeftSection
                imageURL="media/images/coin.png"
                productName="Coin"
                productDesription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
                tryDemo=""
                learnMore=""
                googlePlay=""
                appStore=""
            />
            <RightSection
                imageURL="media/images/kiteconnect.png"
                productName="Kite Connect API"
                productDesription="Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase."
                learnMore=""
            />
            <LeftSection
                imageURL="media/images/varsity.png"
                productName="Varsity mobile"
                productDesription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go."
                tryDemo=""
                learnMore=""
                googlePlay=""
                appStore=""
            />
            <div className="container p-5 mb-5">
                <div className="row text-center">
                    <h1 className="mt-5">Open a Zerodha account</h1>
                    <p>
                        Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
                        F&O trades.
                    </p>
                    <button
                        className="p-2 btn btn-primary fs-5 mb-5"
                        style={{ width: "20%", margin: "0 auto" }}
                    >
                        Sign up Now
                    </button>
                </div>
            </div>
            <Universe />

        </>
    );
}

export default ProductsPage;