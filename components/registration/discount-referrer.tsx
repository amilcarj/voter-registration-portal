import RegistrationForm from "@/components/registration/registration-form";

const POSH_EVENT_URL =
  "https://posh.vip/e/ny-metro-region-spoken-gems?u=emmanuelrodriguez71&_t=mtdng6dg&os=ios&src=event_page&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaftQsG1eRAnQlDL3iZhTR2z5zeBco2iWIkOOK0WSIXadcfd4qejTYDd_zqQvg_aem_A3nr_P9t6iJmgAqMMpSHRg";

const DiscountReferrer = () => {
  return (
    <div>
      <h3 className="text-lg font-bold text-center">
        Want a discount to our{" "}
        <a href={POSH_EVENT_URL} target="_blank" rel="noreferrer">
          next event
        </a>
        ?
      </h3>
      <p className="mb-4">
        Either register to vote or get a friend to register and we&apos;ll send
        you a coupon code!
      </p>
      <RegistrationForm />
    </div>
  );
};

export default DiscountReferrer;
