"use client";

import { useSearchParams } from "next/navigation";

import DiscountReferrer from "@/components/registration/discount-referrer";
import DiscountReferred from "@/components/registration/discount-referred";

const RegistrationContainer = () => {
  const searchParams = useSearchParams();
  const referrerName = searchParams.get("referrer-name");

  const component = referrerName ? (
    <DiscountReferred referrerName={referrerName} />
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
