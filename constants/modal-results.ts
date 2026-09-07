export const ERROR_MODAL_RESULT = "An error occurred. Please try again later.";

export const SUCCESS_MODAL_RESULT = (
  isReferring: boolean,
  isReferred: boolean,
) => {
  if (isReferring) {
    return "Thank you for referring your friend! They'll receive a voter registration email soon and if they register successfully, you'll get an email with a coupon code!";
  }
  return `Thank you for registering to vote! If all looks good, ${isReferred ? "your friend" : "you"} should get an email with a coupon soon!`;
};
