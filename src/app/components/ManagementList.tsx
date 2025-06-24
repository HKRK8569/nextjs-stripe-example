import type Stripe from "stripe";
import { deleteProduct } from "../modules/stripe/actions";
import type { ProductWithPrice } from "../modules/stripe/types";

type ManagementItemProps = {
  item: ProductWithPrice;
  type: "delete" | "buy";
};
type ManagementListProps = {
  list: ProductWithPrice[];
  type: "delete" | "buy";
};

function ManagementItem({ item, type }: ManagementItemProps) {
  return (
    <div className="flex bg-gray-100 p-2 rounded justify-between items-center">
      <div className="flex gap-2">
        <p>{item.product.name}</p>
        <p>{item.price.price}円</p>
      </div>
      <div>
        {type === "delete" ? (
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={item.product.id} />
            <button
              type="submit"
              className="ml-4 rounded py-1 px-2 text-white bg-red-400 hover:opacity-50"
            >
              削除
            </button>
          </form>
        ) : (
          <form>
            <input type="hidden" name="id" value={item.product.id} />
            <button
              type="submit"
              className="ml-4 rounded py-1 px-2 text-white bg-green-400 hover:opacity-50"
            >
              購入
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default async function ManagementList({
  list,
  type,
}: ManagementListProps) {
  return (
    <div className="w-full">
      {list.map((item) => {
        return <ManagementItem key={item.product.id} item={item} type={type} />;
      })}
    </div>
  );
}
