const Footer = () => {
  return (
    <footer class="bg-(--bgd) text-(--light-text)">
      <div class="w-full flex items-center justify-center max-w-[1400px] mx-auto px-4 py-4 text-sm">
        © {new Date().getFullYear()} Built with ❤️ by Abdulrahman
      </div>
    </footer>
  );
};

export default Footer;
