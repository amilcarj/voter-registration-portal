import Hero from "@/components/hero";
import RegistrationContainer from "@/components/registration/registration-container";
import Welcome from "@/components/welcome";

export default function Home() {
  return (
    <main className="flex w-full max-w-3xl flex-col justify-between p-6 sm:p-12 border-2 border-solid bg-white rounded-2xl shadow-2xl/30">
      <Hero />
      <Welcome />
      <RegistrationContainer />
    </main>
  );
}
