import { usePaystackPayment } from 'react-paystack';

export default function PaystackCheckout({ amount, email, onSuccessCallback, children, customStyle, disabled }) {
    // Paystack configuration
    const config = {
        reference: (new Date()).getTime().toString(), // Generates a unique transaction reference
        email: email, // The user's email
        amount: amount * 100, // Convert Naira to Kobo
        publicKey: 'pk_test_6c44650d33bd5883ab044dc8c5b942b967603945', // Note: Good idea to move this to an environment variable (.env) before launch!
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
            disabled={disabled} // <-- Added this line
            onClick={() => {
                initializePayment(onSuccess, onClose)
            }}
            className={customStyle}
        >
            {children}
        </button>
    );
}