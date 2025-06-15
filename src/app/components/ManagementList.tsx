import type Stripe from "stripe";
import { deleteProduct } from "../modules/stripe/actions";

type ManagementItemProps = {
  item: Stripe.Product;
};
type ManagementListProps = {
  list: Stripe.Product[];
};

function ManagementItem({ item }: ManagementItemProps) {
  return (
    <div className="flex bg-gray-100 p-2 rounded justify-between items-center">
      <p>{item.name}</p>
      <div>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={item.id} />
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
        return <ManagementItem key={item.id} item={item} />;
      })}
    </div>
  );
}
