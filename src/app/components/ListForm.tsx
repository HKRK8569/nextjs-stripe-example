import { createProduct } from "../modules/stripe/actions";

export default function ListForm() {
  return (
    <form
      action={createProduct}
      className="w-full flex items-center justify-between"
    >
      <input
        name="name"
        type="text"
        className="rounded outline-1 outline-black p-2 flex-grow"
      />
      <button
        type="submit"
        className="ml-4 rounded py-2 px-4 text-white bg-green-400 hover:opacity-50"
      >
        登録
      </button>
    </form>
  );
}
