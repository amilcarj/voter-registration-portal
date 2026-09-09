"use client";

import { useState } from "react";

import ErrorModal from "@/components/registration/error-modal";
import RegistrationForm from "@/components/registration/registration-form";
import RegistrationFormCompleted from "@/components/registration/registration-form-completed";
import Spinner from "@/components/spinner";

const RegistrationFormContainer = ({
  isSubmitted,
  referrerName,
  referrerEmail,
  setIsSubmitted,
}: {
  isSubmitted: boolean;
  referrerName?: string;
  referrerEmail?: string;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isReferral, setIsReferral] = useState(false);

  const formComponent = isSubmitted ? (
    <RegistrationFormCompleted
      isReferral={isReferral}
      referrerName={referrerName}
    />
  ) : (
    <RegistrationForm
      isSubmitting={isSubmitting}
      setIsReferral={setIsReferral}
      setIsSubmitting={setIsSubmitting}
      setIsSubmitted={setIsSubmitted}
      setShowErrorModal={setShowErrorModal}
      referrerName={referrerName}
      referrerEmail={referrerEmail}
    />
  );

  return (
    <>
      {formComponent}
      <ErrorModal
        closeModal={() => setShowErrorModal(false)}
        showModal={showErrorModal}
      />
      <div
        className={`bg-black/70 flex justify-center items-center fixed inset-0 ${isSubmitting ? "opacity-100 z-9999 transition-all duration-300 visible" : "opacity-0 z-[-9999] transition-all duration-300 invisible"}`}
      >
        <Spinner />
      </div>
    </>
  );
};

export default RegistrationFormContainer;
