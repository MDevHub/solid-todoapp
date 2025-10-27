import { A } from "@solidjs/router";
import heroImg from "~/assets/hero.png";

export default function Home() {
  return (
    <main class="bg-(--overall-bg) text-(--navbg) flex flex-col lg:flex-row  max-w-[1400px] justify-between mx-auto px-5 py-10 md:py-20 gap-10">

      {/* Text Section */}
      <div class="flex-1 text-center lg:text-left mt-6 lg:mt-0">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
          Hey there! <br /> Ready to get things done 🤪?
        </h1>
		   <p class="text- mb-6 text-lg">
          Start organizing, building, and achieving your goals all in one smooth experience.
        </p>
        <A
          href="/signup"
          class="inline-block bg-(--bgd) text-white px-5 py-3 rounded-full transition duration-300"
        >
          Get Started
        </A>
      </div>

      {/* Image Section */}
      <div class="flex-1 flex justify-center">
        <img
          src={heroImg}
          alt="Hero"
          class="max-w-full w- sm:w-full[350px] md:w-[400px] lg:w-full object-contain"
        />
      </div>

    </main>
  );
}
