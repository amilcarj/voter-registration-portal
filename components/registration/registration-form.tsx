"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import InputField from "@/components/registration/form-inputs/input-field";
import PillButton from "@/components/registration/form-inputs/pill-button";
import UploadButton from "@/components/registration/form-inputs/upload-button";
import ResultModal from "@/components/registration/result-modal";
import {
  ERROR_MODAL_RESULT,
  SUCCESS_MODAL_RESULT,
} from "@/constants/modal-results";
import { registerSchema, RegistrationFormData } from "@/schemas/register";

const RegistrationForm = ({
  referrerName,
  referrerEmail,
}: {
  referrerName?: string;
  referrerEmail?: string;
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      isReferring: false,
    },
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });
  const isReferring = useWatch({ control, name: "isReferring" });

  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (isReferring) {
      setValue("verificationImage", undefined);
      clearErrors("verificationImage");
    } else {
      setValue("referredEmail", "");
      clearErrors("referredEmail");
    }
  }, [isReferring, setValue, clearErrors]);

  console.log({ errors, isReferring, isSubmitting, isValid });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("verificationImage", file, { shouldValidate: true });
      setScreenshot(URL.createObjectURL(file));
    } else {
      setValue("verificationImage", undefined, { shouldValidate: true });
      setScreenshot(null);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    if (referrerEmail) {
      formData.append("referrerEmail", referrerEmail);
    }

    try {
      const res = await fetch("/api/register", {
        body: formData,
        method: "POST",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      setModalMessage(
        SUCCESS_MODAL_RESULT(isReferring, referrerEmail !== undefined),
      );
      reset();
    } catch (err) {
      setModalMessage(ERROR_MODAL_RESULT);
      console.error(err);
    } finally {
      setShowResultModal(true);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
      >
        <InputField
          label="What's your first name?"
          placeholder="First Name"
          type="text"
          error={errors.firstName?.message}
          registerProps={{ ...register("firstName") }}
        />
        <InputField
          label="What's your last name?"
          placeholder="Last Name"
          type="text"
          error={errors.lastName?.message}
          registerProps={{ ...register("lastName") }}
        />
        <InputField
          label="What's your email?"
          placeholder="Email"
          type="email"
          error={errors.email?.message}
          registerProps={{ ...register("email") }}
        />
        {!referrerName && (
          <>
            <PillButton
              label="Are you inviting a friend to register?"
              control={control}
            />
            {isReferring && (
              <>
                <InputField
                  label="What's your friend's email?"
                  placeholder="Friend's Email"
                  type="email"
                  error={errors.referredEmail?.message}
                  registerProps={{ ...register("referredEmail") }}
                />
                <p>
                  We&apos;ll send them an email to register to vote. Once they
                  do and get verified, you&apos;ll get an email with a coupon
                  code!
                </p>
              </>
            )}
          </>
        )}
        {!isReferring && (
          <>
            <p className="mb-4">
              Click{" "}
              <a
                href="https://votolatino.org/register/"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              to register to vote!
            </p>
            <p>
              After you register, upload a screenshot of your voter registration
              confirmation email. Make sure it has your name, the email used in
              this form and the date it was sent. If all looks good, we&apos;ll
              send {referrerName || "you"} a coupon for our next event!
            </p>
            <UploadButton
              handleFileUpload={handleFileUpload}
              error={errors.verificationImage?.message}
              screenshot={screenshot}
            />
          </>
        )}
        <button
          className="pill-button primary-button mt-2 self-center"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          Submit
        </button>
      </form>
      <ResultModal
        closeModal={() => setShowResultModal(false)}
        showModal={showResultModal}
        modalMessage={modalMessage}
      />
    </>
  );
};

export default RegistrationForm;
