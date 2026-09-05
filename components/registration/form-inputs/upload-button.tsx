import Image from "next/image";

const UploadButton = ({
  screenshot,
  handleFileUpload,
  error,
}: {
  screenshot: string | null;
  handleFileUpload: React.ChangeEventHandler;
  error?: string;
}) => {
  return (
    <div>
      <label className="pill-button secondary-button mt-2 inline-block cursor-pointer text-center">
        {!!screenshot ? "Change Image" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          required
          multiple={false}
          title="Upload an image"
          onChange={handleFileUpload}
          className="sr-only"
          aria-invalid={!!error}
        />
      </label>
      {error && <p className="text-brand-tertiary mt-1">{error}</p>}
      {screenshot && (
        <div className="mt-3">
          <p className="text-sm font-medium">Preview:</p>
          <div className="relative w-32 h-32 ">
            <Image
              src={screenshot}
              fill
              alt="Selected upload preview"
              className="object-cover rounded-md border border-brand-secondary mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadButton;
