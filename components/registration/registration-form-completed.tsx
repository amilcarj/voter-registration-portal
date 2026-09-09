import { Trophy } from "lucide-react";

import { BASE_APP_URL } from "@/constants/urls";

const RegistrationFormCompleted = ({
  referrerName,
}: {
  referrerName?: string;
}) => {
  return (
    <div className="w-full">
      <Trophy className="mx-auto h-10 w-10 text-brand-primary mb-2" />
      <h3 className="text-lg font-bold text-center mb-2">
        Thank you for registering to vote!
      </h3>
      <p className="text-center text-lg">
        If all looks good, we&apos;ll send {referrerName || "you"} a coupon for
        our next event!
      </p>
      {referrerName && (
        <p className="text-center text-lg">
          Want your own coupon? Click <a href={BASE_APP_URL}>here</a> and refer
          a friend to register to vote!
        </p>
      )}
    </div>
  );
};

export default RegistrationFormCompleted;
