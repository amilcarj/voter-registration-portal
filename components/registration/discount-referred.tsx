import RegistrationForm from "@/components/registration/registration-form";

const DiscountReferred = ({
  referrerName,
  referrerEmail,
}: {
  referrerName: string;
  referrerEmail: string;
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-center mb-4">
        Your friend, {referrerName}, wants you to register to vote!
      </h3>
      <RegistrationForm
        referrerName={referrerName}
        referrerEmail={referrerEmail}
      />
    </div>
  );
};

export default DiscountReferred;
