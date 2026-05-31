import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LegalPage() {
    // State to toggle between the two documents
    const [activeTab, setActiveTab] = useState("terms");

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header & Back Button */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Marketplace
                        </Link>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Legal & Privacy
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Everything you need to know about your rights and data on Campus Mart.
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8">
                    <button
                        onClick={() => setActiveTab("terms")}
                        className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "terms"
                            ? "bg-white text-green-700 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                            }`}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Terms & Conditions
                    </button>
                    <button
                        onClick={() => setActiveTab("privacy")}
                        className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "privacy"
                            ? "bg-white text-green-700 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                            }`}
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy Policy
                    </button>
                </div>

                {/* Content Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">

                    {/* TERMS AND CONDITIONS TAB */}
                    {activeTab === "terms" && (
                        <div className="prose prose-green max-w-none text-gray-600">
                            <div className="border-b border-gray-100 pb-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms and Conditions</h2>
                                <p className="text-sm text-gray-400 font-medium">Last Updated: April 20, 2026</p>
                            </div>

                            <p className="mb-6">
                                Welcome to CampusMart. These Terms and Conditions govern your use of our digital marketplace, designed specifically to connect student entrepreneurs across Nigerian tertiary institutions with buyers. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these terms, please do not use our services.
                            </p>

                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                        Eligibility
                                    </h3>
                                    <ul className="space-y-2 list-none pl-8">
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Age Requirement:</strong> You must be at least 15 years old to use our services.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Seller Verification:</strong> Student entrepreneurs must verify their active academic status at a recognized tertiary institution.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Buyer Obligations:</strong> Buyers must provide accurate payment and delivery information for all transactions.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                        User Accounts
                                    </h3>
                                    <ul className="space-y-2 list-none pl-8">
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Account Creation:</strong> You must provide accurate information and keep your account credentials secure. Impersonation or the use of false identities is strictly prohibited. You are fully responsible for all activity that occurs under your account.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Account Termination:</strong> We reserve the right to suspend or permanently terminate accounts without prior notice for violation of these Terms, fraudulent activity, or abusive behavior.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                        Transactions & Fees
                                    </h3>
                                    <ul className="space-y-2 list-none pl-8">
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Platform Role:</strong> All sales are directly between buyers and student sellers. CampusMart acts solely as the facilitating platform.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Service Fee:</strong> We charge a standard 5% service fee on completed transactions to maintain the platform.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Payment Processing:</strong> Payments are processed securely through verified third-party providers operating in Nigeria (e.g., Paystack).</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold"><strong>Dispute Resolution:</strong> Buyers and sellers should attempt to resolve disputes directly before escalating to CampusMart support.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                                        Content Rules
                                    </h3>
                                    <p className="mb-2">You agree not to post, list, or transmit content that:</p>
                                    <ul className="space-y-2 list-none pl-8">
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Violates intellectual property rights or copyrights.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Contains hate speech, harassment, or discriminatory language.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Is fraudulent, deceptive, or promotes illegal activities.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Contains adult material, weapons, illicit substances, or dangerous goods.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                                        Legal Mumbo Jumbo
                                    </h3>
                                    <p className="mb-3"><strong>Limitation of Liability:</strong> To the maximum extent permitted by Nigerian law, CampusMart is not liable for the quality/safety of products, technical issues, or indirect damages. Our total liability to you is limited to the fees you have paid us in the past 6 months.</p>
                                    <p className="mb-3"><strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
                                    <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">Contact Legal</p>
                                        <p className="text-sm">For legal inquiries or disputes, contact us at: <a href="mailto:legal@campusmart.com" className="text-green-600 hover:underline">legal@campusmart.com</a></p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* PRIVACY POLICY TAB */}
                    {activeTab === "privacy" && (
                        <div className="prose prose-green max-w-none text-gray-600 animate-in fade-in duration-300">
                            <div className="border-b border-gray-100 pb-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
                                <p className="text-sm text-gray-400 font-medium">Last Updated: March 26, 2026</p>
                            </div>

                            <p className="mb-6">
                                Welcome to CampusMart. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our digital marketplace.
                            </p>

                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                        Information We Collect
                                    </h3>
                                    <div className="space-y-4 pl-8">
                                        <div>
                                            <strong className="text-gray-900 block mb-1">Personal Information You Provide:</strong>
                                            <p className="text-sm">Name, email, phone number, school details, business details, and secure account credentials.</p>
                                        </div>
                                        <div>
                                            <strong className="text-gray-900 block mb-1">Automatically Collected Data:</strong>
                                            <p className="text-sm">IP address, browser type, device info, session duration, and cookies.</p>
                                        </div>
                                        <div>
                                            <strong className="text-gray-900 block mb-1">From Third Parties:</strong>
                                            <p className="text-sm">Payment statuses from processors (e.g., Paystack) and analytics data.</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                        How We Use & Share Your Data
                                    </h3>
                                    <p className="mb-3">We utilize your data to operate the marketplace, verify identities, process payments, and detect fraud. <strong>We do not sell your personal data.</strong></p>
                                    <p className="mb-2">We only share information with:</p>
                                    <ul className="space-y-2 list-none pl-8">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Other Users:</strong> Necessary transaction details (like your business name for pickup).</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Trusted Vendors:</strong> Cloud hosting and secure payment processors.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Legal Authorities:</strong> Only if strictly required by Nigerian law.</span>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                        Your Rights (NDPR Compliance)
                                    </h3>
                                    <p className="mb-2">In compliance with the Nigeria Data Protection Regulation (NDPR), you hold the right to:</p>
                                    <ul className="space-y-2 list-none pl-8">
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Access, correct, or request the deletion of your personal data.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Opt-out of non-essential marketing communications.</li>
                                        <li className="relative before:absolute before:content-['•'] before:text-green-500 before:-left-4 before:font-bold">Request a portable copy of your data.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                                        Security & Minors
                                    </h3>
                                    <p className="mb-3">We implement industry-standard encryption and secure servers. However, no digital platform is 100% secure. Please use strong passwords.</p>
                                    <p>CampusMart is not intended for users under the age of 15. We do not knowingly collect personal data from anyone under this age.</p>

                                    {/* <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">Data Protection Officer</p>
                                        <p className="text-sm">To exercise your data rights, contact us at: <a href="mailto:privacy@campusmart.com" className="text-green-600 hover:underline">privacy@campusmart.com</a></p>
                                    </div> */}
                                </section>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}