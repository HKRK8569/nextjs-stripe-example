import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  productsCreate: vi.fn(),
  productsUpdate: vi.fn(),
  productsList: vi.fn(),
  pricesRetrieve: vi.fn(),
  paymentIntentsCreate: vi.fn(),
  customerSessionsCreate: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("stripe", () => ({
  default: class {
    products = {
      create: mocks.productsCreate,
      update: mocks.productsUpdate,
      list: mocks.productsList,
    };
    prices = {
      retrieve: mocks.pricesRetrieve,
    };
    paymentIntents = {
      create: mocks.paymentIntentsCreate,
    };
    customerSessions = {
      create: mocks.customerSessionsCreate,
    };
  },
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import {
  archiveProduct,
  createPaymentIntent,
  createProduct,
  getProductList,
} from "./actions";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STRIPE_CUSTOMER_ID", "cus_test123");
});

describe("createProduct", () => {
  it("フォームの値からdefault_price付きで商品を作成し、/listへリダイレクトする", async () => {
    mocks.productsCreate.mockResolvedValue({ id: "prod_test" });
    const formData = new FormData();
    formData.set("name", "テスト商品");
    formData.set("amount", "500");

    await createProduct(formData);

    expect(mocks.productsCreate).toHaveBeenCalledWith({
      name: "テスト商品",
      default_price_data: {
        unit_amount: 500,
        currency: "jpy",
      },
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/list");
  });
});

describe("archiveProduct", () => {
  it("商品をアーカイブ（active: false）し、/listへリダイレクトする", async () => {
    mocks.productsUpdate.mockResolvedValue({});
    const formData = new FormData();
    formData.set("id", "prod_test");

    await archiveProduct(formData);

    expect(mocks.productsUpdate).toHaveBeenCalledWith("prod_test", {
      active: false,
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/list");
  });
});

describe("getProductList", () => {
  it("default_priceが展開された商品を価格付きで返す", async () => {
    const product = {
      id: "prod_test",
      default_price: { id: "price_test", unit_amount: 100 },
    };
    mocks.productsList.mockResolvedValue({ data: [product] });

    const result = await getProductList();

    expect(mocks.productsList).toHaveBeenCalledWith({
      active: true,
      expand: ["data.default_price"],
    });
    expect(result).toEqual([
      {
        product,
        price: { id: "price_test", price: 100 },
      },
    ]);
  });

  it("default_priceがない商品は価格IDが空文字・金額0になる", async () => {
    const product = { id: "prod_test", default_price: null };
    mocks.productsList.mockResolvedValue({ data: [product] });

    const result = await getProductList();

    expect(result).toEqual([
      {
        product,
        price: { id: "", price: 0 },
      },
    ]);
  });
});

describe("createPaymentIntent", () => {
  const price = { id: "price_test", unit_amount: 100 };

  it("価格の金額でPaymentIntentとCustomerSessionを作成し、両方のclient_secretを返す", async () => {
    mocks.pricesRetrieve.mockResolvedValue(price);
    mocks.paymentIntentsCreate.mockResolvedValue({
      client_secret: "pi_secret",
    });
    mocks.customerSessionsCreate.mockResolvedValue({
      client_secret: "cuss_secret",
    });

    const result = await createPaymentIntent("price_test");

    expect(mocks.paymentIntentsCreate).toHaveBeenCalledWith({
      amount: 100,
      currency: "jpy",
      customer: "cus_test123",
    });
    expect(mocks.customerSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_test123" })
    );
    expect(result).toEqual({
      clientSecret: "pi_secret",
      customerSessionClientSecret: "cuss_secret",
    });
  });

  it("STRIPE_CUSTOMER_IDが未設定の場合はundefinedを返す", async () => {
    vi.stubEnv("STRIPE_CUSTOMER_ID", "");

    const result = await createPaymentIntent("price_test");

    expect(result).toBeUndefined();
    expect(mocks.paymentIntentsCreate).not.toHaveBeenCalled();
  });

  it("価格に金額がない場合はundefinedを返す", async () => {
    mocks.pricesRetrieve.mockResolvedValue({ ...price, unit_amount: null });

    const result = await createPaymentIntent("price_test");

    expect(result).toBeUndefined();
    expect(mocks.paymentIntentsCreate).not.toHaveBeenCalled();
  });

  it("PaymentIntentのclient_secretが取得できない場合はundefinedを返す", async () => {
    mocks.pricesRetrieve.mockResolvedValue(price);
    mocks.paymentIntentsCreate.mockResolvedValue({ client_secret: null });

    const result = await createPaymentIntent("price_test");

    expect(result).toBeUndefined();
    expect(mocks.customerSessionsCreate).not.toHaveBeenCalled();
  });
});
