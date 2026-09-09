import { AlertCircle } from "lucide-react";

const ErrorModal = ({
  showModal,
  closeModal,
}: {
  showModal: boolean;
  closeModal: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div
      className={`bg-black/70 flex justify-center items-center fixed inset-0 ${showModal ? "opacity-100 z-9999 transition-all duration-300 visible" : "opacity-0 z-[-9999] transition-all duration-300 invisible"}`}
    >
      <div className="bg-white justify-center items-center flex-col rounded-lg h-auto w-70 p-2.5 md:p-5 ">
        <AlertCircle className="mx-auto h-10 w-10 text-brand-tertiary mb-2" />
        <h3 className="text-lg font-semibold text-brand-tertiary text-center">
          Something went wrong
        </h3>
        <p className="mt-1 text-sm text-brand-secondary text-center">
          An error occurred. Please try again.
        </p>
        <button
          onClick={closeModal}
          className={`pill-button primary-button mt-2.5 mb-0 font-bold`}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
