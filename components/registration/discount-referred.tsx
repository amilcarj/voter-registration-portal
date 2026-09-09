"use client";

import { useState } from "react";

import RegistrationFormContainer from "@/components/registration/registration-form-container";

const DiscountReferred = ({
  referrerName,
  referrerEmail,
}: {
  referrerName: string;
  referrerEmail: string;
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="w-full">
      {!isSubmitted && (
        <h3 className="text-lg font-bold text-center mb-4">
          Your friend, {referrerName}, wants you to register to vote!
        </h3>
      )}
      <RegistrationFormContainer
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        referrerName={referrerName}
        referrerEmail={referrerEmail}
      />
    </div>
  );
};

export default DiscountReferred;
