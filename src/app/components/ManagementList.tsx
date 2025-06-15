import type Stripe from "stripe";
import { deleteProduct } from "../modules/stripe/actions";
import type { ProductWithPrice } from "../modules/stripe/types";

type ManagementItemProps = {
  item: ProductWithPrice;
};
type ManagementListProps = {
  list: ProductWithPrice[];
};

function ManagementItem({ item }: ManagementItemProps) {
  return (
    <div className="flex bg-gray-100 p-2 rounded justify-between items-center">
      <div className="flex gap-2">
        <p>{item.product.name}</p>
        <p>{item.price}円</p>
      </div>
      <div>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={item.product.id} />
          <button
            type="submit"
            className="ml-4 rounded py-1 px-2 text-white bg-red-400 hover:opacity-50"
          >
            削除
          </button>
        </form>
      </div>
    </div>
  );
}
export default async function ManagementList({ list }: ManagementListProps) {
  return (
    <div className="w-full">
      {list.map((item) => {
        return <ManagementItem key={item.product.id} item={item} />;
      })}
    </div>
  );
}
