"use client";

import { useState } from "react";

import RegistrationFormContainer from "@/components/registration/registration-form-container";
import { POSH_EVENT_URL } from "@/constants/urls";

const DiscountReferrer = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="w-full">
      {!isSubmitted && (
        <>
          <h3 className="text-lg font-bold text-center">
            Want a discount to our{" "}
            <a href={POSH_EVENT_URL} target="_blank" rel="noreferrer">
              next event
            </a>
            ?
          </h3>
          <p className="mb-4">
            Either register to vote or get a friend to register and we&apos;ll
            send you a coupon code!
          </p>
        </>
      )}
      <RegistrationFormContainer
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
      />
    </div>
  );
};

export default DiscountReferrer;
