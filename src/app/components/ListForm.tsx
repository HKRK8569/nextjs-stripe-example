import { createProduct } from "../modules/stripe/actions";

export default function ListForm() {
  return (
    <form
      action={createProduct}
      className="w-full flex items-center justify-between"
    >
      <div className="flex flex-grow gap-2">
        <input
          name="name"
          type="text"
          placeholder="名前"
          required
          className="rounded outline-1 w-1/2 outline-black p-2"
        />
        <input
          name="amount"
          type="number"
          min={1}
          placeholder="値段"
          required
          className="rounded outline-1 w-1/2 outline-black p-2"
        />
      </div>
      <button
        type="submit"
        className="ml-4 rounded py-2 px-4 text-white bg-green-400 hover:opacity-50"
      >
        登録
      </button>
    </form>
  );
}
