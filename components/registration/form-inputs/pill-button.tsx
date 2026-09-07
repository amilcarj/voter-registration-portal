import { Control, Controller } from "react-hook-form";

import { RegistrationFormData } from "@/schemas/register";
import { cn } from "@/utils/tw-merge";

const PillButton = ({
  label,
  control,
}: {
  label: string;
  control: Control<RegistrationFormData>;
}) => {
  return (
    <label className="flex items-center gap-2 mb-4">
      {label}
      <Controller
        control={control}
        name="isReferring"
        render={({ field: { value, onChange } }) => (
          <button
            type="button"
            role="switch"
            aria-checked={value}
            aria-label="Invite a friend to register?"
            onClick={() => onChange(!value)}
            className="relative inline-flex h-10 w-24 cursor-pointer rounded-full bg-brand-secondary p-1 transition-colors"
          >
            <div
              className={cn(
                "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-brand-quaternary shadow-sm transition-transform duration-200 ease-in-out",
                value ? "translate-x-0" : "translate-x-full",
              )}
            />
            <div className="relative z-10 grid w-full grid-cols-2 items-center text-center text-sm font-bold select-none">
              <span
                className={cn(
                  "transition-colors duration-200",
                  value ? "text-brand-tertiary" : "text-brand-primary",
                )}
              >
                Yes
              </span>
              <span
                className={cn(
                  "transition-colors duration-200",
                  !value ? "text-brand-tertiary" : "text-brand-primary",
                )}
              >
                No
              </span>
            </div>
          </button>
        )}
      />
    </label>
  );
};

export default PillButton;
