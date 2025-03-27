import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "../utils/db.server";

type Product = {
  id: string;
  name: string;
  price: number;
  desc: string;
  img: string;
  error?: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      return new Response(JSON.stringify({ error: "Product Not Found!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default function SanPham() {
  const data: Product = useLoaderData();
  console.log(data)
  return (
    <main className="w-4/5 min-h-screen pt-20 m-auto">
      {data.error ? (
        <div className="text-red-500 text-2xl text-center">{data.error}</div>
      ) : (
        <div className="flex">
          <div className="w-1/2 pt-10">
            <img
              src={data.img}
              alt={data.name}
              className="w-11/12 border-2 border-black rounded"
            />
          </div>
          <div className="w-1/2 pt-10">
            <div className="text-lg text-red-500 w-fit border-2 border-teal-500 rounded px-2">
              Mã: {data.id}
            </div>
            <div className="text-4xl py-2">{data.name}</div>
            <div className="text-2xl text-green-500 my-2">
              {Intl.NumberFormat("vi-VN").format(data.price)} VND
            </div>
            <div className="w-fit bg-sky-100 border-2 border-teal-500 rounded my-2">
              <i className="fa-light fa-phone mx-2 text-xl"></i>
              <Link to="tel:+86822594131" className="text-xl">
                0822594131
              </Link>
            </div>
          </div>
        </div>
      )}
      {data && (
        <div className="pt-10">
          <div className="text-2xl text-emerald-800 before:content-[''] before:grow before:border-b-2 before:border-teal-500 after:content-[''] after:grow after:border-b-2 after:border-teal-500 flex justify-center items-center">
            Thông Tin Sản Phẩm
          </div>
          <div
            className="text-xl py-4"
            dangerouslySetInnerHTML={{ __html: data.desc }}
          />
        </div>
      )}
    </main>
  )
}