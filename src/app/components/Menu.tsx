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
          "h-full w-full flex items-center justify-center border-l border-r font-bold",
          active === "list"
            ? "bg-gray-50 text-black"
            : " bg-white text-gray-500"
        )}
      >
        出品
      </Link>
      <Link
        href="/delete"
        className={twMerge(
          "h-full w-full flex items-center rounded-r justify-center font-bold",
          active === "delete"
            ? "bg-gray-50 text-black"
            : " bg-white text-gray-500"
        )}
      >
        削除
      </Link>
    </div>
  );
}
