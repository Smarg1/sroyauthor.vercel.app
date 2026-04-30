'use client';

import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

import type { SearchResult } from '@/lib/types/app.types';
import { searchContent } from '@/utils/fetchData';

const MIN_QUERY = 2;
const DEBOUNCE_MS = 220;
const MAX_CACHE = 40;
const MAX_QUERY_LENGTH = 80;

const NAV_ITEMS = [
  { href: '/#about', label: 'About' },
  { href: '/books', label: 'Books' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contributions', label: 'Contributions' },
  { href: '#contact', label: 'Contact' },
] as const;

const EMPTY_RESULTS: SearchResult[] = [];

function normalizeQuery(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function useDebouncedValue<T>(value: T, delay = DEBOUNCE_MS) {
  const [state, setState] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(value);
    }, delay);

    return () => {
      window.clearTimeout(id);
    };
  }, [value, delay]);

  return state;
}

function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

function useEscape(handler: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handler]);
}

function pushCache(cache: Map<string, SearchResult[]>, key: string, value: SearchResult[]) {
  if (cache.has(key)) {
    cache.delete(key);
  }

  cache.set(key, value);

  if (cache.size > MAX_CACHE) {
    const oldest = cache.keys().next().value;

    if (oldest) {
      cache.delete(oldest);
    }
  }
}

const NavLinks = memo(function NavLinks({
  onClick,
  mobile = false,
}: {
  onClick?: () => void;
  mobile?: boolean;
}) {
  return NAV_ITEMS.map(({ href, label }) => {
    const props = onClick ? { onClick } : {};

    return (
      <Link
        key={label}
        href={href}
        {...props}
        className={
          mobile
            ? 'text-on-secondary hover:text-on-secondary-container'
            : 'text-on-secondary hover:text-on-secondary-container hover:bg-secondary-container rounded-full px-4 py-2 text-2xl font-medium transition-colors'
        }
      >
        {label}
      </Link>
    );
  });
});

const SearchItem = memo(function SearchItem({
  item,
  closeAll,
}: {
  item: SearchResult;
  closeAll: () => void;
}) {
  const src = item.cover?.trimEnd() || '/not-found.svg';

  return (
    <Link
      href={`/${item.type}s/${item.slug}`}
      onClick={closeAll}
      className="group block border-b border-white/5 px-6 py-4.5 transition-colors hover:bg-secondary-container"
    >
      <span className="flex items-center gap-4">
        <Image
          src={src}
          alt={item.slug}
          width={80}
          height={120}
          loading="lazy"
          sizes="64px"
          className="h-auto w-16 rounded-md object-cover"
        />

        <div className="min-w-0">
          <div className="text-on-secondary group-hover:text-on-secondary-container truncate text-lg font-bold">
            {item.title}
          </div>

          {item.description ? (
            <div className="text-on-secondary/70 group-hover:text-on-secondary-container/70 mt-1 line-clamp-2 text-sm">
              {item.description}
            </div>
          ) : null}

          <div className="text-on-secondary/40 group-hover:text-on-secondary-container/40 mt-1 text-xs font-bold uppercase">
            {item.type}
          </div>
        </div>
      </span>
    </Link>
  );
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(EMPTY_RESULTS);

  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);
  const cache = useRef(new Map<string, SearchResult[]>());

  const debounced = useDebouncedValue(query);
  const deferred = useDeferredValue(debounced);
  const normalized = normalizeQuery(deferred);

  const clearResults = useCallback(() => {
    startTransition(() => {
      setResults(EMPTY_RESULTS);
    });
  }, []);

  const closeSearch = useCallback(() => {
    requestId.current += 1;
    setQuery('');
    clearResults();
    setSearchOpen(false);
  }, [clearResults]);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    closeSearch();
  }, [closeSearch]);

  useBodyLock(menuOpen || searchOpen);
  useEscape(closeAll);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    if (normalized.length < MIN_QUERY) {
      clearResults();
      return;
    }

    const cached = cache.current.get(normalized);

    if (cached) {
      startTransition(() => {
        setResults(cached);
      });

      return;
    }

    const id = ++requestId.current;
    let cancelled = false;

    startTransition(async () => {
      try {
        const response = await searchContent(normalized, 1);

        if (cancelled || requestId.current !== id) {
          return;
        }

        const next = response.rows.map<SearchResult>((row) => {
          const base: Partial<SearchResult> = {
            slug: row.slug,
            title: row.title,
            description: row.description,
            type: row.type,
            cover: row.cover_url ?? '/not-found.svg',
          };

          if (row.id !== undefined && row.id !== null) {
            base.id = row.id;
          }

          return base as SearchResult;
        });

        pushCache(cache.current, normalized, next);
        setResults(next);
      } catch {
        if (!cancelled && requestId.current === id) {
          setResults(EMPTY_RESULTS);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [normalized, searchOpen, clearResults]);

  const hasQuery = normalized.length >= MIN_QUERY;

  return (
    <>
      <nav className="bg-secondary/90 fixed inset-x-0 top-0 z-50 outline backdrop-blur-md supports-backdrop-filter:bg-secondary/80">
        <div className="mx-auto flex h-(--mobile-nav-height) max-w-7xl items-center justify-between px-6 md:h-(--nav-height) md:px-12 lg:justify-center-safe">
          <Link href="/#" onClick={closeAll} className="flex items-center">
            <Image
              src="/images/favicon/logo.svg"
              alt="Logo"
              width={150}
              height={80}
              priority
              sizes="150px"
              className="h-12 w-auto transition-transform hover:scale-105 lg:mr-6 lg:h-14"
            />
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <NavLinks />

            <button
              type="button"
              aria-label="Open search"
              onClick={() => {
                setSearchOpen(true);
              }}
              className="text-on-secondary hover:text-on-secondary-container hover:bg-secondary-container hover:cursor-pointer rounded-full p-3 transition-colors"
            >
              <MagnifyingGlassIcon className="size-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label="Open search"
              onClick={() => {
                setSearchOpen(true);
              }}
              className="text-on-secondary hover:text-on-secondary-container hover:bg-secondary-container hover:cursor-pointer rounded-full p-2 transition-colors"
            >
              <MagnifyingGlassIcon className="size-6" />
            </button>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-controls="mobile-panel"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((value) => !value);
              }}
              className="text-on-secondary hover:text-on-secondary-container hover:bg-secondary-container hover:cursor-pointer rounded-full p-2 transition-colors"
            >
              {menuOpen ? <XMarkIcon className="size-7" /> : <Bars3Icon className="size-7" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-panel"
        className={[
          'bg-secondary fixed top-16 right-0 left-0 z-50 lg:hidden transition-all duration-300',
          menuOpen
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 -translate-y-2',
        ].join(' ')}
      >
        <nav className="flex flex-col gap-6 px-8 py-8 text-2xl">
          <NavLinks
            mobile
            onClick={() => {
              setMenuOpen(false);
            }}
          />
        </nav>
      </div>

      <div
        className={[
          'fixed inset-0 z-60 flex items-start justify-center bg-black/60 backdrop-blur-xl transition-opacity duration-300',
          searchOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <button
          type="button"
          aria-label="Close search"
          onClick={closeSearch}
          className="absolute inset-0 hover:cursor-pointer"
        />

        <div className="relative mt-28 w-full max-w-4xl px-6">
          <div className="bg-secondary/95 flex items-center gap-4 rounded-full px-4 py-3 shadow-2xl">
            <MagnifyingGlassIcon className="text-on-secondary size-6 shrink-0" />

            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value.slice(0, MAX_QUERY_LENGTH));
              }}
              type="text"
              placeholder="Search..."
              autoComplete="off"
              spellCheck={false}
              maxLength={MAX_QUERY_LENGTH}
              className="text-on-secondary placeholder:text-on-secondary/60 w-full bg-transparent text-xl outline-none"
            />

            <button
              type="button"
              aria-label="Close"
              onClick={closeSearch}
              className="text-on-secondary hover:text-on-secondary-container hover:bg-secondary-container hover:cursor-pointer rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl bg-secondary/95 shadow-2xl">
            <div className="search-scrollbar max-h-[52vh] overflow-y-auto">
              {isPending ? (
                <div className="px-6 py-4.5 text-on-secondary/70">Searching...</div>
              ) : null}

              {!isPending && hasQuery && results.length === 0 ? (
                <div className="px-6 py-4.5 text-on-secondary/70">No results found.</div>
              ) : null}

              {!isPending
                ? results.map((item) => (
                    <SearchItem key={item.id ?? item.slug} item={item} closeAll={closeAll} />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
