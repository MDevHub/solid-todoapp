import { A } from "@solidjs/router";
import logo from "~/assets/logo.png";

export default function Nav() {
	return (
		<nav class="bg-(--bgd) text-(--light-text)">
			<div class="w-full flex items-center justify-between max-w-[1400px] mx-auto px-4 md:px-3 py-4">
			
			{/* Left side: logo + title */}
			<A href="/" class="flex items-center gap-1 md:gap-3">
				<img src={logo} alt="Logo" class="w-8 md:w-10 h-8 md:h-10" />
				<span class="text-white text-lg md:text-2xl font-semibold tracking-wide">
					TodoList
				</span>
			</A>
			{/* Right side: auth buttons */}
			<div class="flex items-center gap-2 md:gap-4">
				<A
					href="/signin"
					class="text-(--light-text) text-lg md:text-xl px-3 md:px-4 py-2 rounded-full hover:bg-(--light-text) hover:text-(--dark-text) transition"
				>
					Login
				</A>

				<A
					href="/signup"
					class="text-(--light-text) border border-(--light-text) px-3 md:px-4 py-2 rounded-full hover:bg-(--light-text) hover:text-(--dark-text) transition"
				>
					Sign Up
				</A>
			</div>
			</div>
		</nav>
	);
}
