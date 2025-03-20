import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Carousel } from "../components/Carousel";
import { prisma } from "../utils/db.server";

type Product = {
  type: string;
  item: {
    id: string;
    name: string;
    price: number;
    img: string;
  }[];
};

export const loader: LoaderFunction = async () => {
  try {
    const types = [
      "REM_VAI",
      "REM_CAU_VONG",
      "REM_GO",
      "REM_CUON",
      "REM_LA_LAT",
      "REM_KHAC",
    ];
    const products = await Promise.all(
      types.map(async (type) => {
        const items = await prisma.product.findMany({
          where: { type },
          take: 20,
        });
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
        return { type, item: items };
      })
    );
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export default function Index() {
  const data: Product[] = useLoaderData();
  const img = ["/app/IMG/RTK_00.png", "/app/IMG/RTK_00.png"];
  const MenuSP = [
    { sp: "Rèm Vải", type: "REM_VAI" },
    { sp: "Rèm Cầu Vồng", type: "REM_CAU_VONG" },
    { sp: "Rèm Gỗ", type: "REM_GO" },
    { sp: "Rèm Cuốn", type: "REM_CUON" },
    { sp: "Rèm Lá Lật", type: "REM_LA_LAT" },
    { sp: "Rèm Khác", type: "REM_KHAC" },
  ];
  return (
    <main className="min-h-screen">
      <Carousel img={img} />
      <img
        src="/app/IMG/RTK.png"
        alt="RTK"
        className="w-1/12 border-b-2 border-teal-500 py-4 my-4 mx-auto"
      />
      <div className="w-4/5 pb-10 m-auto">
        {data.length !== 0 ? (
          data.map((dt) => (
            <div
              className="bg-sky-100 border-4 border-teal-500 rounded p-4 my-10"
              key={dt.type}
            >
              <div className="text-4xl text-emerald-800 before:content-[''] before:grow before:border-b-2 before:border-teal-500 after:content-[''] after:grow after:border-b-2 after:border-teal-500 flex justify-center items-center">
                {MenuSP.find((sp) => sp.type === dt.type)?.sp || dt.type}
              </div>
              <div className="grid grid-cols-5 gap-4 pt-4 overflow-auto">
                {dt.item.map((pd) => (
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
            </div>
          ))
        ) : (
          <div className="m-auto loader"></div>
        )}
      </div>
    </main>
  )
}