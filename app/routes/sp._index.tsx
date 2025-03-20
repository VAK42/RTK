import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { useState, useMemo } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/db.server";

type Product = {
  id: string;
  name: string;
  price: number;
  img: string;
  type: string;
};

export const loader: LoaderFunction = async ({ request }) => {
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

export default function SP() {
  const { data, total, page, limit } = useLoaderData<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
  }>();
  const [search, setSearch] = useState<string>("");
  const [showSort, setShowSort] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "REM_VAI";
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(`/sp?type=${type}&search=${search}&page=1`);
  };
  const handleType = (type: string) => {
    setSearch("");
    navigate(`/sp?type=${type}&page=1`);
  };
  const MenuSP = [
    { sp: "Rèm Vải", type: "REM_VAI" },
    { sp: "Rèm Cầu Vồng", type: "REM_CAU_VONG" },
    { sp: "Rèm Gỗ", type: "REM_GO" },
    { sp: "Rèm Cuốn", type: "REM_CUON" },
    { sp: "Rèm Lá Lật", type: "REM_LA_LAT" },
    { sp: "Rèm Khác", type: "KHAC" },
  ];
  const sort = [
    { value: "id", order: "asc", label: "Mã SP Tăng Dần" },
    { value: "id", order: "desc", label: "Mã SP Giảm Dần" },
    { value: "price", order: "asc", label: "Giá SP Tăng Dần" },
    { value: "price", order: "desc", label: "Giá SP Giảm Dần" },
  ];
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
      <div className="border-t-2 border-teal-500 flex">
        <div className="w-1/5 h-fit border-b-2 border-teal-500">
          {MenuSP.map((item) => (
            <button
              onClick={() => handleType(item.type)}
              key={item.type}
              className={`w-full flex justify-start items-center p-4 ${item.type === type
                ? "text-white bg-black"
                : "hover:text-white hover:bg-[rgba(0,0,0,0.8)]"
                }`}
            >
              <i className="fa-light fa-arrow-right mx-2"></i>
              {item.sp}
            </button>
          ))}
        </div>
        <div className="w-4/5 min-h-screen border-l-2 border-teal-500">
          <div className="flex p-2">
            <div className="w-5/6">
              <Input
                value={search}
                placeholder="Mã SP"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="border-2 border-black rounded-none"
              >
                <Input.Icon>
                  <i className="fa-light fa-magnifying-glass"></i>
                </Input.Icon>
              </Input>
            </div>
            <div className="w-1/6 inline-block">
              <Button
                variant="outline"
                className="h-full border-2 border-black float-left rounded-none"
                onClick={handleSearch}
              >
                <i className="fa-light fa-magnifying-glass"></i>
              </Button>
              <Button
                variant="outline"
                className={`h-full border-2 border-black float-right ${showSort === true ? "text-white bg-black" : ""
                  }`}
                onClick={() => setShowSort(!showSort)}
              >
                {showSort === true ? (
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
                      to={`/sp?type=${type}&sort=${opt.value}&order=${opt.order}&search=${search}&page=1`}
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
          {data.length !== 0 ? (
            <div className="grid grid-cols-4 gap-2 p-2 overflow-auto">
              {data.map((pd) => (
                <Link
                  to={`/sp/${pd.id}`}
                  key={pd.id}
                  className="h-[20vw] border-2 border-teal-500"
                >
                  <div className="w-full h-2/3 border-b-2 border-teal-500">
                    <img
                      src={pd.img}
                      alt={pd.id}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="h-1/3 text-white bg-[rgba(0,0,0,0.8)] p-2">
                    <div className="h-1/4 text-pink-200">Mã: {pd.id}</div>
                    <div className="h-1/2 text-xl truncate">{pd.name}</div>
                    <div className="h-1/4 text-green-200 text-lg float-right">
                      {Intl.NumberFormat("vi-VN").format(pd.price)} VND
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="m-auto loader"></div>
          )}
          <div aria-live="polite" className="flex justify-center my-4">
            {page > 1 && (
              <div className="mx-2">
                <Link
                  to={`/sp?type=${type}&sort=${searchParams.get("sort") || "id"
                    }&order=${searchParams.get("order") || "asc"
                    }&search=${search}&page=1`}
                >
                  <i className="fa-light fa-chevrons-left mr-4"></i>
                </Link>
                <Link
                  to={`/sp?type=${type}&sort=${searchParams.get("sort") || "id"
                    }&order=${searchParams.get("order") || "asc"
                    }&search=${search}&page=${page - 1}`}
                >
                  <i className="fa-light fa-arrow-left"></i>
                </Link>
              </div>
            )}
            {pagination.map((num, index) => (
              <div key={index} className="mx-2">
                <Link
                  to={`/sp?type=${type}&sort=${searchParams.get("sort") || "id"
                    }&order=${searchParams.get("order") || "asc"
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
                  to={`/sp?type=${type}&sort=${searchParams.get("sort") || "id"
                    }&order=${searchParams.get("order") || "asc"
                    }&search=${search}&page=${page + 1}`}
                >
                  <i className="fa-light fa-arrow-right"></i>
                </Link>
                <Link
                  to={`/sp?type=${type}&sort=${searchParams.get("sort") || "id"
                    }&order=${searchParams.get("order") || "asc"
                    }&search=${search}&page=${sumPages}`}
                >
                  <i className="fa-light fa-chevrons-right ml-4"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}