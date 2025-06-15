import ListForm from "../components/ListForm";
import ManagementList from "../components/ManagementList";
import Menu from "../components/Menu";
import { getProductList } from "../modules/stripe/actions";

export default async function List() {
  const data = await getProductList();

  return (
    <div>
      <Menu active="list" />
      <div className="mt-10">
        <ListForm />
      </div>
      <div className="mt-10">
        <ManagementList list={data.data} />
      </div>
    </div>
  );
}
