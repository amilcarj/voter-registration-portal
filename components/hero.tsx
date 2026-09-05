import Image from "next/image";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full text-center pb-3">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Image
          className="w-full max-w-[200px] sm:max-w-[250px] h-auto object-contain"
          src="/lul-logo.webp"
          alt="La Unidad Latina Logo"
          width={3554}
          height={1103}
          priority
        />
        <Image
          className="w-full max-w-[250px]"
          src="/voto-latino-logo.webp"
          alt="Voto Latino Logo"
          width={480}
          height={79}
          priority
        />
      </div>
      <h1 className="text-brand-primary text-4xl font-bold mt-4 sm:mt-0">EVERY VOTE MATTERS</h1>
      <h2 className="text-2xl font-bold">Make your voice heard</h2>
    </section>
  );
};

export default Hero;
