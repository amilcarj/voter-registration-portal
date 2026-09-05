"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/registration/form-inputs/input-field";
import PillButton from "@/components/registration/form-inputs/pill-button";
import UploadButton from "@/components/registration/form-inputs/upload-button";

import { registerSchema, FormData } from "@/utils/schemas/register";

const RegistrationForm = ({ referrerName }: { referrerName?: string }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      isReferring: false,
    },
    mode: "onBlur",
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
    if (file && typeof window !== "undefined") {
      setValue("verificationImage", file, { shouldValidate: true });
      setScreenshot(URL.createObjectURL(file));
    } else {
      setValue("verificationImage", undefined, { shouldValidate: true });
      setScreenshot(null);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={() => handleSubmit(onSubmit)}
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
        disabled={!isValid}
      >
        Submit
      </button>
    </form>
  );
};

export default RegistrationForm;
