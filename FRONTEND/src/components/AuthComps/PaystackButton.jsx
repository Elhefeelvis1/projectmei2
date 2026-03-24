import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
// import { useAuth } from '../components/AuthComps/CheckAuth'; // Assuming you need user email

export default function PaystackCheckout({ amount, email, onSuccessCallback }) {
    // Paystack configuration
    const config = {
        reference: (new Date()).getTime().toString(), // Generates a unique transaction reference
        email: email, // The user's email
        amount: amount * 100, // Convert Naira to Kobo
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_YOUR_TEST_KEY_HERE', 
    };

    const initializePayment = usePaystackPayment(config);

    // What happens when the user successfully completes the payment popup
    const onSuccess = (reference) => {
        console.log("Payment successful! Reference:", reference);
        // We will pass this reference to your Supabase backend to verify and give value
        if (onSuccessCallback) {
            onSuccessCallback(reference);
        }
    };

    // What happens if the user closes the popup
    const onClose = () => {
        console.log("User closed the payment modal.");
    };

    return (
        <button 
            onClick={() => {
                initializePayment(onSuccess, onClose)
            }}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
        >
            Pay ₦{amount.toLocaleString()}
        </button>
    );
}