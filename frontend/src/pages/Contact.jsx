import React from "react";
import TopNavBar from "../components/TopNavBar"; // Ensure the path is correct

function ContactPage() {
  return (
    <div>
      <TopNavBar />
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-lg text-center mb-6">
          Our mission is to make our customers happy by providing exceptional service and support. We are always here to help you with any questions or concerns.
        </p>
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg">
            <strong>Phone:</strong> <a href="tel:+254723070808" className="text-blue-500 hover:underline">0723 070 808</a>
          </p>
          <p className="text-lg mt-2">
            <strong>Email:</strong> <a href="mailto:gitere01@gmail.com" className="text-blue-500 hover:underline">gitere01@gmail.com</a>
          </p>
          <p className="text-lg mt-2">
            <strong>Address:</strong> Nairobi, Kenya
          </p>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">We’re Here for You</h2>
          <p className="text-lg">
            Whether you have a question about our services, need assistance, or just want to give feedback, we’re all ears! Feel free to reach out to us anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
