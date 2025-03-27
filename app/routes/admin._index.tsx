import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Button, Input, Select } from "@material-tailwind/react";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/db.server";
import { sessionStorage } from "../utils/session.server";
import { Tiptap } from "~/components/Tiptap";

type Product = {
  id: string;
  name: string;
  price: number;
  desc: string;
  img: string;
  type: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage().getSession(
    request.headers.get("Cookie")
  );
  const usr = session.get("usr");
  if (!usr) {
    return redirect("/");
  }
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "REM_VAI";
    const search = url.searchParams.get("search") || "";
    const field = url.searchParams.get("sort") || "id";
    const direction = url.searchParams.get("order") || "asc";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = 20;
    const skip = (page - 1) * limit;
    const order = { [field]: direction };
    const where = {
      type,
      id: { contains: search, mode: Prisma.QueryMode.insensitive },
    };
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limit, orderBy: order }),
      prisma.product.count({ where }),
    ]);
    return new Response(
      JSON.stringify({ data: products, total, page, limit }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ data: [], total: 0, page: 1, limit: 20 }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const session = await sessionStorage().getSession(
      request.headers.get("Cookie")
    );
    const data = await request.formData();
    const action = data.get("_action");
    const id = data.get("id")?.toString();
    const name = data.get("name")?.toString();
    const price = data.get("price")?.toString();
    const desc = data.get("desc")?.toString();
    const type = data.get("type")?.toString();
    const img = data.get("img") as File;
    const file = fileURLToPath(import.meta.url);
    const dir = dirname(file);
    let url = "";
    if (img && img.size > 0) {
      const buffer = await img.arrayBuffer();
      const name = `${Date.now()}${img.name}`;
      const lct = path.join(dir, "..", "IMG", name);
      fs.writeFileSync(lct, Buffer.from(buffer));
      url = `/app/IMG/${name}`;
    }
    switch (action) {
      case "logout":
        const cookie = await sessionStorage().destroySession(session);
        return redirect("/", {
          headers: { "Set-Cookie": cookie },
        });
      case "create":
        await prisma.product.create({
          data: {
            id: id!,
            name: name!,
            price: parseInt(price!),
            desc: desc!,
            img: url,
            type: type!,
          },
        });
        return { success: true };
      case "update":
        if (id) {
          const pd = await prisma.product.findUnique({
            where: { id },
          });
          if (pd && pd.img) {
            const url = path.join(dir, "../..", pd.img);
            if (fs.existsSync(url)) {
              fs.unlinkSync(url);
            }
          }
          await prisma.product.update({
            where: { id },
            data: {
              name: name!,
              price: parseInt(price!),
              desc: desc!,
              img: url,
              type: type!,
            },
          });
        }
        return { success: true };
      case "delete":
        if (id) {
          const pd = await prisma.product.findUnique({
            where: { id },
          });
          if (pd && pd.img) {
            const url = path.join(dir, "../..", pd.img);
            if (fs.existsSync(url)) {
              fs.unlinkSync(url);
            }
          }
          await prisma.product.delete({
            where: { id },
          });
        }
        return { success: true };
      default:
        throw new Error("Invalid Action!");
    }
  } catch {
    return { success: false };
  }
};

export default function Admin() {
  const { data, total, page, limit } = useLoaderData<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
  }>();
  const { success } = useActionData<{ success: boolean }>() || {
    success: null,
  };
  const [result, setResult] = useState<any>(null);
  const [count, setCount] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [showSort, setShowSort] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mode, setMode] = useState<"default" | "create" | "update">("default");
  const [pd, setPd] = useState<Product | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(
      `/admin?type=${searchParams.get("type") || "REM_VAI"
      }&search=${search}&page=1`
    );
  };
  const handleEdit = (product: Product) => {
    setPd(product);
    let updType: string = MenuSP[0].type;
    if (typeof product.type === 'string') {
      for (let i = 0; i < MenuSP.length; i++) {
        if (MenuSP[i].type === product.type) {
          updType = MenuSP[i].type;
          break;
        }
      }
    }
    setPdType(updType);
    let updContent: string = "";
    if (typeof product.desc === 'string') {
      updContent = product.desc;
    }
    setContent(updContent);
    setMode("update");
  };
  const handleCreate = () => {
    setPd(null);
    setPdType(MenuSP[0].type);
    setContent("");
    setMode("create");
  };
  const handleCancel = () => {
    setPd(null);
    setMode("default");
  };
  const handleType = (type: string) => {
    setShowMenu(false);
    setSearch("");
    navigate(`/admin?type=${type}&page=1`);
  };
  useEffect(() => {
    if (success !== null) {
      setResult(success);
      handleCancel();
      const timer = setTimeout(() => {
        setResult(null);
        setContent("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, count]);
  const sort = [
    { value: "id", order: "asc", label: "Mã SP Tăng Dần" },
    { value: "id", order: "desc", label: "Mã SP Giảm Dần" },
    { value: "price", order: "asc", label: "Giá SP Tăng Dần" },
    { value: "price", order: "desc", label: "Giá SP Giảm Dần" },
  ];
  const MenuSP = [
    { sp: "Rèm Vải", type: "REM_VAI" },
    { sp: "Rèm Cầu Vồng", type: "REM_CAU_VONG" },
    { sp: "Rèm Gỗ", type: "REM_GO" },
    { sp: "Rèm Cuốn", type: "REM_CUON" },
    { sp: "Rèm Lá Lật", type: "REM_LA_LAT" },
    { sp: "Rèm Khác", type: "REM_KHAC" },
  ];
  const [pdType, setPdType] = useState<string>(MenuSP[0].type);
  const sumPages = Math.ceil(total / limit);
  const pagination = useMemo(() => {
    const pages = [];
    if (sumPages > 1) {
      if (page > 1) pages.push(page - 1);
      pages.push(page);
      if (page < sumPages) pages.push(page + 1);
    }
    return [...new Set(pages)];
  }, [sumPages, page]);
  return (
    <main className="w-4/5 min-h-screen pt-12 m-auto">
      <img src="/app/IMG/RTK.png" alt="RTK" className="w-1/12 py-10 m-auto" />
      <div className="border-t-2 border-teal-500">
        <div className="flex py-2">
          <div className="w-2/3">
            <Input
              value={search}
              placeholder="Mã SP"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="border-2 border-black rounded-none"
            />
          </div>
          <div className="w-1/3 inline-block">
            <Button
              variant="outline"
              onClick={handleSearch}
              className="h-full border-2 border-black float-left rounded-none"
            >
              <i className="fa-light fa-magnifying-glass"></i>
            </Button>
            <Button
              variant="outline"
              onClick={handleCreate}
              className="h-full border-2 border-black mx-2"
            >
              <i className="fa-solid fa-plus"></i>
            </Button>
            <Form method="post" className="inline">
              <input type="hidden" name="_action" value="logout" />
              <Button
                type="submit"
                variant="outline"
                className="h-full border-2 border-black mx-2"
              >
                <i className="fa-solid fa-door-open"></i>
              </Button>
            </Form>
            <div className="inline-flex relative mx-2">
              <Button
                variant="outline"
                onClick={() => setShowMenu(!showMenu)}
                className={`border-2 border-black ${showMenu ? "text-white bg-black" : ""
                  }`}
              >
                {MenuSP.find((sp) => sp.type === searchParams.get("type"))
                  ?.sp || "Rèm Vải"}
                {showMenu ? (
                  <i className="fa-solid fa-xmark ml-2"></i>
                ) : (
                  <i className="fa-light fa-angle-down ml-2"></i>
                )}
              </Button>
              {showMenu && (
                <div className="bg-white border-2 border-black flex flex-col mt-12 absolute">
                  {MenuSP.map((opt) => (
                    <button
                      key={opt.type}
                      className="text-left p-1 hover:text-white hover:bg-black"
                      onClick={() => handleType(opt.type)}
                    >
                      {opt.sp}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className={`h-full border-2 border-black float-right ${showSort ? "text-white bg-black" : ""
                }`}
              onClick={() => setShowSort(!showSort)}
            >
              {showSort ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-light fa-filter"></i>
              )}
            </Button>
            {showSort && (
              <div className="bg-white border-2 border-black flex flex-col absolute right-4">
                {sort.map((opt) => (
                  <Link
                    key={opt.value}
                    to={`/admin?type=${searchParams.get("type") || "REM_VAI"
                      }&sort=${opt.value}&order=${opt.order
                      }&search=${search}&page=1`}
                    className="p-1 hover:text-white hover:bg-black"
                    onClick={() => setShowSort(!showSort)}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {result !== null &&
          (result ? (
            <div className="text-teal-500 text-center">OK!</div>
          ) : (
            <div className="text-red-500 text-center">Failed!</div>
          ))}
        {mode === "default" && (
          <div>
            {data.length !== 0 ? (
              <table className="w-full border-2 border-black border-collapse my-4">
                <thead>
                  <tr className="text-white bg-black">
                    <td className="w-1/12 text-center">ID</td>
                    <td className="w-1/6 text-center">Name</td>
                    <td className="w-1/6 text-center">Price</td>
                    <td className="w-1/3 text-center">Description</td>
                    <td className="w-1/12 text-center">Image</td>
                    <td className="w-1/6 text-center">Misc</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map((pd) => (
                    <tr key={pd.id}>
                      <td className="border border-black truncate px-2 text-center">
                        {pd.id}
                      </td>
                      <td className="border border-black truncate px-2">
                        {pd.name}
                      </td>
                      <td className="border border-black truncate px-2 text-center">
                        {Intl.NumberFormat("vi-VN").format(pd.price)} VND
                      </td>
                      <td
                        className="border border-black truncate px-2"
                        dangerouslySetInnerHTML={{ __html: pd.desc }}
                      />
                      <td className="border border-black">
                        <img
                          src={pd.img}
                          alt={pd.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </td>
                      <td className="border border-black text-center">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(pd)}
                          className="border-2 border-black mx-2"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Button>
                        <Form method="post" className="inline">
                          <input type="hidden" name="_action" value="delete" />
                          <input type="hidden" name="id" value={pd.id} />
                          <Button
                            type="submit"
                            variant="outline"
                            onClick={() => setCount((prev) => prev + 1)}
                            className="border-2 border-black mx-2"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </Button>
                        </Form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="m-auto loader"></div>
            )}
            <div aria-live="polite" className="flex justify-center my-4">
              {page > 1 && (
                <div className="mx-2">
                  <Link
                    to={`/admin?type=${searchParams.get("type") || "REM_VAI"
                      }&sort=${searchParams.get("sort") || "id"}&order=${searchParams.get("order") || "asc"
                      }&search=${search}&page=1`}
                  >
                    <i className="fa-light fa-chevrons-left mr-4"></i>
                  </Link>
                  <Link
                    to={`/admin?type=${searchParams.get("type") || "REM_VAI"
                      }&sort=${searchParams.get("sort") || "id"}&order=${searchParams.get("order") || "asc"
                      }&search=${search}&page=${page - 1}`}
                  >
                    <i className="fa-light fa-arrow-left"></i>
                  </Link>
                </div>
              )}
              {pagination.map((num, index) => (
                <div key={index} className="mx-2">
                  <Link
                    to={`/admin?type=${searchParams.get("type") || "REM_VAI"
                      }&sort=${searchParams.get("sort") || "id"}&order=${searchParams.get("order") || "asc"
                      }&search=${search}&page=${num}`}
                    className={`p-2 rounded ${page === num ? "bg-teal-500" : "bg-gray-300"
                      }`}
                  >
                    {num}
                  </Link>
                </div>
              ))}
              {page < sumPages && (
                <div className="mx-2">
                  <Link
                    to={`/admin?type=${searchParams.get("type") || "REM_VAI"
                      }&sort=${searchParams.get("sort") || "id"}&order=${searchParams.get("order") || "asc"
                      }&search=${search}&page=${page + 1}`}
                  >
                    <i className="fa-light fa-arrow-right"></i>
                  </Link>
                  <Link
                    to={`/admin?type=${searchParams.get("type") || "REM_VAI"
                      }&sort=${searchParams.get("sort") || "id"}&order=${searchParams.get("order") || "asc"
                      }&search=${search}&page=${sumPages}`}
                  >
                    <i className="fa-light fa-chevrons-right ml-4"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        {mode === "create" && (
          <Form method="post" encType="multipart/form-data" className="mt-2">
            <input
              name="img"
              id="img"
              type="file"
              className="hidden"
              required
            />
            <label htmlFor="img"><i className="fa-solid fa-cloud-arrow-up text-4xl cursor-pointer"></i></label>
            <Input
              name="id"
              placeholder="ID"
              className="w-1/3 border-2 border-black my-2"
              required
            />
            <Input
              name="name"
              placeholder="Name"
              className="w-1/3 border-2 border-black my-2"
              required
            />
            <Input
              name="price"
              placeholder="Price"
              type="number"
              className="w-1/3 border-2 border-black my-2"
              required
            />
            <Select name="type" value={pdType} onValueChange={setPdType}>
              <Select.Trigger
                placeholder="Type"
                className="w-1/3 border-2 border-black my-2"
              />
              <Select.List className="border-2 border-black">
                {MenuSP.map((item) => (
                  <Select.Option key={item.type} value={item.type}>
                    {item.sp}
                  </Select.Option>
                ))}
              </Select.List>
            </Select>
            <Tiptap data={content} onEdit={setContent} />
            <input type="hidden" name="desc" value={content} />
            <input type="hidden" name="_action" value="create" />
            <div className="my-2">
              <Button
                type="submit"
                onClick={() => setCount((prev) => prev + 1)}
                className="float-right"
              >
                Create
              </Button>
              <Button type="button" onClick={handleCancel}>
                Back
              </Button>
            </div>
          </Form>
        )}
        {mode === "update" && (
          <Form method="post" encType="multipart/form-data" className="mt-2">
            <div className="flex my-4">
              <div className="w-1/2">
                <input
                  name="img"
                  id="img"
                  type="file"
                  className="hidden"
                  required
                />
                <label htmlFor="img"><i className="fa-solid fa-cloud-arrow-up text-4xl cursor-pointer"></i></label>
                <Input
                  name="id"
                  placeholder="ID"
                  defaultValue={pd?.id}
                  className="w-2/3 border-2 border-black my-2"
                  required
                />
                <Input
                  name="name"
                  placeholder="Name"
                  defaultValue={pd?.name}
                  className="w-2/3 border-2 border-black my-2"
                  required
                />
                <Input
                  name="price"
                  placeholder="Price"
                  type="number"
                  defaultValue={pd?.price}
                  className="w-2/3 border-2 border-black my-2"
                  required
                />
                <Select name="type" value={pdType} onValueChange={setPdType}>
                  <Select.Trigger
                    placeholder="Type"
                    className="w-2/3 border-2 border-black my-2"
                  />
                  <Select.List className="border-2 border-black">
                    {MenuSP.map((item) => (
                      <Select.Option key={item.type} value={item.type}>
                        {item.sp}
                      </Select.Option>
                    ))}
                  </Select.List>
                </Select>
              </div>
              <div className="w-1/2">
                <img src={pd?.img} alt="RTK" className="border-2 border-black" />
              </div>
            </div>
            <Tiptap data={content} onEdit={setContent} />
            <input type="hidden" name="desc" value={content} />
            <input type="hidden" name="_action" value="update" />
            <div className="my-2">
              <Button
                type="submit"
                onClick={() => setCount((prev) => prev + 1)}
                className="float-right"
              >
                Update
              </Button>
              <Button type="button" onClick={handleCancel}>
                Back
              </Button>
            </div>
          </Form>
        )}
      </div>
    </main>
  )
}