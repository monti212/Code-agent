import { type ComponentProps } from "solid-js"

// U Code mark: teal tile, white "U", orange dot (see BRANDING.md). Brand colours are
// fixed, so the mark reads the same on every theme.
const MarkArt = () => (
  <>
    <rect width="64" height="64" rx="14" fill="#0096B3" />
    <path
      d="M19 16v22.5c0 7.1 4.7 11.5 13 11.5s13-4.4 13-11.5V16h-7v22c0 3.5-2.1 5.7-6 5.7s-6-2.2-6-5.7V16h-7z"
      fill="#FFFFFF"
    />
    <circle cx="49" cy="46" r="3.5" fill="#FF6A00" />
  </>
)

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MarkArt />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MarkArt />
    </svg>
  )
}

// "u code" in the pixel wordmark style; "u" in the base tone, "code" in the strong tone.
export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 156 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g>
        <path d="M18 30H6V18H18V30Z" fill="var(--icon-weak-base)" />
        <path d="M6 30H18V6H24V36H0V6H6V30Z" fill="var(--icon-base)" />
        <path d="M66 30H48V18H66V30Z" fill="var(--icon-weak-base)" />
        <path d="M66 12H48V30H66V36H42V6H66V12Z" fill="var(--icon-strong-base)" />
        <path d="M90 30H78V18H90V30Z" fill="var(--icon-weak-base)" />
        <path d="M90 12H78V30H90V12ZM96 36H72V6H96V36Z" fill="var(--icon-strong-base)" />
        <path d="M120 30H108V18H120V30Z" fill="var(--icon-weak-base)" />
        <path d="M120 12H108V30H120V12ZM126 36H102V6H120V0H126V36Z" fill="var(--icon-strong-base)" />
        <path d="M156 24V30H138V24H156Z" fill="var(--icon-weak-base)" />
        <path d="M138 12V18H150V12H138ZM156 24H138V30H156V36H132V6H156V24Z" fill="var(--icon-strong-base)" />
      </g>
    </svg>
  )
}
