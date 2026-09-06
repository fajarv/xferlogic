import Link from 'next/link';

const LOGO_URL = 'https://raw.githubusercontent.com/fajarv/xferlogic/site-v8-preview/logo.webp';

export default function BrandMark({ href='/', compact=false, showProduct=true }) {
  const content = (
    <span className="flex items-center gap-3">
      <img
        src={LOGO_URL}
        alt="XferLogic"
        className={compact ? 'h-9 w-auto shrink-0' : 'h-11 w-auto shrink-0'}
      />
      <span className="leading-none">
        <span className="block text-sm font-black tracking-[0.17em] text-white">XFERLOGIC</span>
        {showProduct && <span className="mt-1 block text-[10px] font-bold tracking-[0.22em] text-cyan-300">XL100</span>}
      </span>
    </span>
  );

  return href ? <Link href={href} aria-label="XferLogic XL100 home">{content}</Link> : content;
}
