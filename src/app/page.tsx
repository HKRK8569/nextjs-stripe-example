import ManagementList from "./components/ManagementList";
import Menu from "./components/Menu";
import { getProductList } from "./modules/stripe/actions";

export default async function Home() {
  const data = await getProductList();
  return (
    <div>
      <Menu active="buy" />
      <div className="mt-10">
        <ManagementList list={data} type="buy" />
      </div>
    </div>
  );
}
