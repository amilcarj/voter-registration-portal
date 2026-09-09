export type SelfRegistrationPayload = {
  jobId: string;
  email: string;
  firstName: string;
  lastName: string;
  imagePath: string;
};

export type ReferredRegistrationPayload = {
  jobId: string;
  email: string;
  firstName: string;
  lastName: string;
  referrerEmail: string;
  imagePath: string;
};

export type ReferFriendPayload = {
  jobId: string;
  email: string;
  referredEmail: string;
  firstName: string;
  lastName: string;
};
