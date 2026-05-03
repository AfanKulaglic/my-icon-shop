import clsx from "clsx";

export default function Button({
  children,
  variant = "accent",
  className,
  ...rest
}) {
  return (
    <button
      className={clsx(
        variant === "accent" ? "btn-accent" : "btn-ghost",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
