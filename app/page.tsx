import { Suspense } from "react";

import Hero from "@/components/hero";
import RegistrationContainer from "@/components/registration/registration-container";
import Welcome from "@/components/welcome";

export default function Home() {
  return (
    <main className="flex w-full max-w-3xl flex-col justify-between rounded-2xl border-2 border-solid bg-white p-6 shadow-2xl/30 sm:p-12">
      <Hero />
      <Welcome />
      <Suspense fallback={<div>Loading form...</div>}>
        <RegistrationContainer />
      </Suspense>
    </main>
  );
}
