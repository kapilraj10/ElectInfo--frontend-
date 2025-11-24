import React, {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type FormEvent,
} from 'react';

interface MenuItem {
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    console.log('Searching for:', q);
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeMenu();
      menuButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const onClick = (e: MouseEvent | any) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuButtonRef.current?.contains(e.target)
      ) {
        closeMenu();
      }
    };

    const onKey = (e: KeyboardEvent | any) => {
      if (e.key === 'Escape') {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      const id = setTimeout(() => firstLinkRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [isMenuOpen]);

  const menuItems: MenuItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className="flex items-center justify-between flex-wrap bg-white py-4 lg:px-12 shadow border-t-2 border-blue-700"
      role="navigation"
      aria-label="Main"
    >
      {/* Logo + Mobile Toggle */}
      <div className="flex justify-between w-full lg:w-auto pl-6 pr-2 border-b-2 lg:border-b-0 border-gray-300 pb-5 lg:pb-0">
        <div className="flex items-center text-gray-800 mr-16">
          <a
            href="/"
            className="font-semibold text-xl tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            ElectInfo
          </a>
        </div>

        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          className="lg:hidden flex items-center px-3 py-2 border-2 rounded text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-menu"
        >
          <HamburgerIcon open={isMenuOpen} />
        </button>
      </div>

      {/* Menu Container */}
      <div
        id="primary-menu"
        ref={menuRef}
        onKeyDown={onMenuKeyDown}
        className={`${isMenuOpen ? 'block' : 'hidden'} w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8`}
      >
        {/* Menu Links */}
        <div className="text-md font-bold text-blue-700 lg:flex-grow">
          {menuItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              ref={index === 0 ? firstLinkRef : null}
              className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => isMenuOpen && closeMenu()}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Search + Login */}
        <div className="flex flex-col lg:flex-row lg:items-center w-full lg:w-auto">
          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="relative mx-auto text-gray-600 lg:block hidden mr-4"
            role="search"
            aria-label="Site search"
          >
            <label htmlFor="desktop-search" className="sr-only">
              Search
            </label>
            <input
              id="desktop-search"
              className="border-2 border-gray-300 bg-white h-10 pl-3 pr-10 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-2.5 mr-2 p-1 rounded text-gray-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Submit search"
            >
              <SearchIcon />
            </button>
          </form>

          {/* Login Button */}
          <a
            href="/login"
            className="mt-4 lg:mt-0 inline-block px-5 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors text-center"
          >
            Login
          </a>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="relative mt-4 lg:hidden block text-gray-600 w-full"
        >
          <label htmlFor="mobile-search" className="sr-only">
            Search
          </label>
          <input
            id="mobile-search"
            className="border-2 border-gray-300 bg-white h-10 pl-3 pr-10 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 mt-2.5 mr-2 p-1 rounded text-gray-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Submit search"
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;

/* ---------------------------
   ICON COMPONENTS
---------------------------- */

interface HamburgerProps {
  open: boolean;
}

const HamburgerIcon: React.FC<HamburgerProps> = ({ open }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={open ? 'M6 18L18 6M6 6l12 12' : 'M3 6h18M3 12h18M3 18h18'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg
    className="text-gray-600 h-4 w-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.966 56.966"
    aria-hidden="true"
  >
    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23  
        s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  
        c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z  
        M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
  </svg>
);
