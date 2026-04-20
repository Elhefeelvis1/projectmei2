import React, { useEffect, useState } from 'react';

export default function PaystackCheckout({ amount, email, onSuccessCallback, children, customStyle, disabled }) {
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load the official Paystack script when the component mounts
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // 2. Handle the payment natively
    const handlePayment = () => {
        if (!isLoaded || !window.PaystackPop) {
            console.error("Paystack is still loading.");
            return;
        }

        const handler = window.PaystackPop.setup({
            key: 'pk_test_6c44650d33bd5883ab044dc8c5b942b967603945', // Note: This is 'key', not 'publicKey' in the native script
            email: email,
            amount: amount * 100,
            ref: (new Date()).getTime().toString(),

            callback: function (response) {
                console.log("Payment successful! Full Response:", response);
                if (onSuccessCallback) {
                    onSuccessCallback(response);
                }
            },

            onClose: function () {
                console.log("User closed the payment modal.");
            }
        });

        handler.openIframe();
    };

    return (
        <button
            disabled={disabled}
            onClick={handlePayment}
            className={customStyle}
        >
            {children}
        </button>
    );
}