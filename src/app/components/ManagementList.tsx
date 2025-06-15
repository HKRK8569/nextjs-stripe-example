import type Stripe from "stripe";

type ManagementItemProps = {
  item: Stripe.Product;
};
type ManagementListProps = {
  list: Stripe.Product[];
};

function ManagementItem({ item }: ManagementItemProps) {
  return (
    <div>
      <p>{item.name}</p>
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
