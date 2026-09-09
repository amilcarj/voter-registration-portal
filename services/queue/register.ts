import { ERROR_MESSAGES, JOB_STATUS, VOTER_CONFIRMATIONS_STORAGE_KEY } from "@/constants/worker-processing";
import {
  inngest,
  selfRegistrationSubmitted,
  referredRegistrationSubmitted,
} from "@/lib/inngest/client";
import { supabaseClient } from "@/lib/supabase";
import { RegistrationFormData } from "@/schemas/register";

const uploadImage = async (file: File | undefined) => {
  if (!file) {
    throw new Error(ERROR_MESSAGES.IMAGE_MISSING);
  }
  const filePath = `uploads/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(VOTER_CONFIRMATIONS_STORAGE_KEY)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
  }

  return filePath;
};

const createVerificationJob = async (
  data: RegistrationFormData,
  filePath: string,
) => {
  const { data: job, error: dbError } = await supabaseClient
    .from("verification_jobs")
    .insert({
      email: data.email,
      image_path: filePath,
      status: JOB_STATUS.PENDING,
    })
    .select("id")
    .single();

  if (dbError || !job) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_RECORD_JOB);
  }

  return job;
};

const sendInngestEvent = async (
  data: RegistrationFormData,
  filePath: string,
  jobId: string,
  eventName: string,
  referrerEmail?: string,
) => {
  await inngest.send({
    data: {
      email: data.email,
      firstName: data.firstName,
      imagePath: filePath,
      jobId,
      lastName: data.lastName,
      referrerEmail,
    },
    name: eventName,
  });
};

export async function handleSelfRegistration(data: RegistrationFormData) {
  const filePath = await uploadImage(data.verificationImage);
  const job = await createVerificationJob(data, filePath);
  sendInngestEvent(data, filePath, job.id, selfRegistrationSubmitted.name);

  return {
    jobId: job.id,
    message: "Verification processing started",
    success: true,
  };
}

export async function handleReferredRegistration(
  data: RegistrationFormData,
  referrerEmail: string,
) {
  const filePath = await uploadImage(data.verificationImage);
  const job = await createVerificationJob(data, filePath);
  await sendInngestEvent(
    data,
    filePath,
    job.id,
    referredRegistrationSubmitted.name,
    referrerEmail,
  );

  return {
    jobId: job.id,
    message: "Referred user verification processing started",
    success: true,
  };
}
