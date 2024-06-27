import * as React from "react";
import { SVGProps } from "react";
import cx from "classnames";
const IconClose = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cx("group", className)}
    {...props}
  >
    <path
      d="M17.25 6.75136L6.75 17.2514M17.25 17.2514L6.75 6.75136L17.25 17.2514Z"
      stroke="#94A7C6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:stroke-white"
    />
  </svg>
);
export default IconClose;
