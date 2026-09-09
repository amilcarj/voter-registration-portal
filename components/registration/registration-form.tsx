"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import InputField from "@/components/registration/form-inputs/input-field";
import PillButton from "@/components/registration/form-inputs/pill-button";
import UploadButton from "@/components/registration/form-inputs/upload-button";
import { registerSchema, RegistrationFormData } from "@/schemas/register";

const RegistrationForm = ({
  isSubmitting,
  setIsReferral,
  setIsSubmitting,
  setIsSubmitted,
  setShowErrorModal,
  referrerEmail,
  referrerName,
}: {
  isSubmitting: boolean;
  setIsReferral: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  referrerEmail?: string;
  referrerName?: string;
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
    mode: "all",
    resolver: zodResolver(registerSchema),
  });
  const isReferring = useWatch({ control, name: "isReferring" });
  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    if (isReferring) {
      setValue("verificationImage", undefined);
      clearErrors("verificationImage");
    } else {
      setValue("referredEmail", "");
      clearErrors("referredEmail");
    }
  }, [isReferring, setValue, clearErrors]);

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

      reset();
      setIsReferral(isReferring);
      setIsSubmitted(true);
      setScreenshot(null);
    } catch (err) {
      setShowErrorModal(true);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center"
    >
      <div className="flex w-full flex-col sm:gap-3 sm:flex-row">
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
      </div>
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
                We&apos;ll send them an email to register to vote. Once they do
                and get verified, you&apos;ll get an email with a coupon code!
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
            confirmation email. If no email is sent, upload a screenshot of the
            registration site&apos;s confirmation page. We&apos;re looking for
            signs of an official confirmation from your state! If all looks
            good, we&apos;ll send {referrerName || "you"} a coupon for our next
            event!
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
  );
};

export default RegistrationForm;
