import { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/utils/tw-merge";

const InputField = ({
  label,
  type,
  placeholder,
  registerProps,
  error,
}: {
  label: string;
  type: string;
  registerProps: UseFormRegisterReturn;
  placeholder?: string;
  error?: string;
}) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-1 flex-col mb-4">
      <label htmlFor={id} className="flex flex-col mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="on"
        required
        aria-invalid={!!error}
        className={cn(
          "p-2 border-solid border border-brand-secondary rounded-md outline-none shadow focus:border-brand-primary",
          error &&
            "border-brand-tertiary border-2 focus:border-brand-tertiary",
        )}
        {...registerProps}
      />
      {error && <p className="text-brand-tertiary mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
