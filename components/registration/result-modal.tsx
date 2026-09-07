const ResultModal = ({
  modalMessage,
  showModal,
  closeModal,
}: {
  modalMessage: string;
  showModal: boolean;
  closeModal: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div
      className={`bg-black/70 flex justify-center items-center fixed inset-0 ${showModal ? "opacity-100 z-9999 transition-all duration-300 visible" : "opacity-0 z-[-9999] transition-all duration-300 invisible"}`}
    >
      <div className="bg-white justify-center items-center flex-col rounded-lg h-auto w-70 p-2.5 md:p-5 ">
        <div className="font-bold text-lg text-center">{modalMessage}</div>
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

export default ResultModal;
