import React,{memo} from "react";
export const SvgIcon = memo(({ children, className = "w-5 h-5", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {children}
    </svg>
));

export const ReadingIcon = memo(() => <SvgIcon><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></SvgIcon>);
export const MenuIcon = memo(() => <SvgIcon><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></SvgIcon>);
export const ArrowLeftIcon = memo(() => <SvgIcon><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></SvgIcon>);
export const PrevIcon = memo(() => <SvgIcon className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></SvgIcon>);
export const NextIcon = memo(() => <SvgIcon className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></SvgIcon>);
export const ChevronDownIcon = memo(() => <SvgIcon className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></SvgIcon>);
export const InfoIcon = memo(() => <SvgIcon><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></SvgIcon>);
export const BookIcon = memo(() => <SvgIcon><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></SvgIcon>);
export const TagIcon = memo(() => <SvgIcon><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></SvgIcon>);
export const LinkIcon = memo(() => <SvgIcon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></SvgIcon>);
export const PageIcon = memo(() => <SvgIcon className="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></SvgIcon>);
export const LanguageIcon = memo(() => <SvgIcon className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></SvgIcon>);
export const CreatorsIcon = memo(() => <SvgIcon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></SvgIcon>);
export const DescriptionIcon = memo(() => <SvgIcon><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></SvgIcon>);
export const LogoIcon = memo(() => <SvgIcon className="w-7 h-7 text-purple-300"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" /></SvgIcon>);
export const HeartIcon = memo(({ filled = false, className = "w-5 h-5" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill={filled ? "currentColor" : "none"} />
    </svg>
));