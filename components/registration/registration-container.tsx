"use client";

import { useSearchParams } from "next/navigation";

import DiscountReferred from "@/components/registration/discount-referred";
import DiscountReferrer from "@/components/registration/discount-referrer";

const RegistrationContainer = () => {
  const searchParams = useSearchParams();
  const referrerName = searchParams.get("referrer-name") || "";
  const referrerEmail = searchParams.get("referrer-email") || "";

  const component = referrerName ? (
    <DiscountReferred
      referrerName={referrerName}
      referrerEmail={referrerEmail}
    />
  ) : (
    <DiscountReferrer />
  );

  return (
    <section className="flex flex-col items-center justify-center w-full pb-3">
      {component}
    </section>
  );
};

export default RegistrationContainer;
