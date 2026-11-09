import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/* Brand-aligned shadcn Button: square, technical, >=44px hit area (size "icon"
   included), focus ring comes from the global :focus-visible rule in index.css
   (--focus-ring), colours come from the BMW M tokens so both themes work. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-[var(--radius)] border border-transparent font-(family-name:--font-tech) text-[0.8125rem] font-semibold uppercase leading-tight tracking-[0.16em] whitespace-nowrap select-none transition-colors duration-200 disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-(--text-heading) text-(--bg-primary) hover:bg-(--m-red) hover:text-white active:bg-[#b30016] active:text-white",
        outline:
          "border-(--border-strong) bg-[rgba(var(--overlay-rgb),0.04)] text-(--text-primary) hover:border-(--text-heading) hover:bg-[rgba(var(--overlay-rgb),0.1)] hover:text-(--text-heading) active:bg-[rgba(var(--overlay-rgb),0.16)]",
        secondary:
          "bg-(--bg-surface-elevated) text-(--text-primary) border-(--border-subtle) hover:border-(--border-light) hover:text-(--text-heading)",
        ghost:
          "text-(--text-secondary) hover:bg-[rgba(var(--overlay-rgb),0.08)] hover:text-(--text-heading)",
        destructive:
          "bg-(--m-red) text-white hover:bg-[#b30016]",
        link: "text-(--text-primary) normal-case tracking-normal underline underline-offset-4 decoration-[rgba(var(--overlay-rgb),0.4)] hover:text-(--m-red-text) hover:decoration-current",
      },
      size: {
        default: "min-h-11 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "min-h-8 gap-1 px-3 text-xs",
        sm: "min-h-10 gap-2 px-4 text-xs",
        lg: "min-h-12 px-8",
        icon: "size-11",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
