import React from "react";
export interface ButtonProps {
  ghost?: boolean;
  block?: boolean;
  disabled?: boolean;
}
const Button: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & ButtonProps
> = ({ children, block = false, ghost = false, ...props }) => {
  return (
    <button
      {...props}
      className={`${
        props.className
      } p-2  font-bold rounded-md justify-self-end ${block ? "w-full" : ""} ${
        ghost
          ? `bg-white-500 text-primary-500`
          : `text-white-500 bg-primary-500 `
      } border-solid border-2 border-primary-500 
        hover:border-primary-600 hover:text-white-500 hover:bg-primary-600  focus:outline-none`}
    >
      {children}
    </button>
  );
};

export default Button;
