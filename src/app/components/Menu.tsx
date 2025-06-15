import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Props = {
  active: "buy" | "list" | "delete";
};
export default function Menu({ active }: Props) {
  return (
    <div className="border h-9 rounded-md flex justify-between items-center">
      <Link
        href="/"
        className={twMerge(
          "h-full w-full flex items-center rounded-l justify-center font-bold",
          active === "buy" ? "bg-gray-50 text-black" : " bg-white text-gray-500"
        )}
      >
        購入
      </Link>
      <Link
        href="/list"
        className={twMerge(
          "h-full w-full flex items-center justify-center border-l font-bold rounded-r",
          active === "list"
            ? "bg-gray-50 text-black"
            : " bg-white text-gray-500"
        )}
      >
        商品管理
      </Link>
    </div>
  );
}
