import {json, Link, useLoaderData, useLocation} from "@remix-run/react";
import {useEffect, useState} from "react";
import type {LoaderFunction} from "@remix-run/node";
import prisma from "~/prisma";

type Product = {
    id: string;
    name: string;
    price: string;
    img: string;
    type: string;
};

export const loader: LoaderFunction = async () => {
    const product = await prisma.product.findMany()
    return json(product)
};

export default function SP() {
    const location = useLocation();
    const [type, setType] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeParam = params.get('type');

        if (typeParam) {
            setType(typeParam);
        }
    }, [location.search]);

    const product: Product[] = useLoaderData();
    const [pdType, setPdType] = useState(type);
    const MenuSP = [
        {sp: "Rèm Vải", type: "REM_VAI"},
        {sp: "Rèm Cầu Vồng", type: "REM_CAU_VONG"},
        {sp: "Rèm Gỗ", type: "REM_GO"},
        {sp: "Rèm Cuốn", type: "REM_CUON"},
        {sp: "Rèm Lá Lật", type: "REM_LA_LAT"},
    ];
    const subMenuSP = product.filter(pd => pd.type === pdType);
    return (
        <>
            <main className="min-h-screen pt-20">
                <div className="w-4/5 border-b-4 border-solid border-teal-500 m-auto py-10">
                    <div className="text-white bg-[rgba(0,0,0,0.8)] border-t-2 border-solid border-teal-500 flex">
                        {MenuSP.map((sp) => (
                            <button key={sp.sp}
                                    className={`w-1/5 flex justify-center items-center p-4 ${sp.type === pdType ? 'text-teal-300 border-b-2 border-solid border-teal-500' : 'anmt hover:text-teal-300'}`}
                                    onClick={() => setPdType(sp.type)}>{sp.sp}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-5 gap-4 pt-4 overflow-auto">
                        {subMenuSP.map((pd) => (
                            <Link to={`/sp/${pd.id}`} key={pd.id}
                                  className="h-[25vw] border-2 border-solid border-teal-500 rounded">
                                <div className="w-full h-2/3 border-b-2 border-solid border-teal-500">
                                    <img src={pd.img} alt={pd.id} className="min-w-full min-h-full"/>
                                </div>
                                <div className="h-1/3 text-white bg-[rgba(0,0,0,0.8)] p-2">
                                    <div className="h-1/4 text-pink-200">Mã {pd.id}</div>
                                    <div className="h-1/2 text-xl truncate">{pd.name}</div>
                                    <div className="h-1/4 text-green-200 text-lg float-right">{pd.price} VND</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}