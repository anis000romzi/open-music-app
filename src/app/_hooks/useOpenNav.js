import { useRef, useState, useEffect } from 'react';

function useOpenNav() {
  const ref = useRef(null);
  const [navOpen, setNavOpen] = useState(false);

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setNavOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { ref, navOpen, setNavOpen };
}

export default useOpenNav;
