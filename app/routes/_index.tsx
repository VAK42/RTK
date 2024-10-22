import type {LoaderFunction, MetaFunction} from "@remix-run/node";
import {Link, json, useLoaderData} from "@remix-run/react";
import prisma from "../prisma";
import Carousel from "~/components/Carousel";
import {useState} from "react";

export const meta: MetaFunction = () => {
    return [
        {name: "charSet", content: "UTF-8"},
        {
            name: "viewport",
            content: "width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        },
        {httpEquiv: "X-UA-Compatible", content: "IE=edge"},
        {name: "title", content: "Rèm Tuấn Kiệt"},
        {name: "msapplication-TileColor", content: "#fff"},
        {name: "msapplication-config", content: "/IMG/Favicon/browserconfig.xml"},
        {name: "theme-color", content: "#fff"},
    ];
};

type Product = {
    id: string;
    name: string;
    price: number;
    img: string;
    type: string;
};

export const loader: LoaderFunction = async () => {
    const types = await prisma.product.findMany({
        select: {
            type: true,
        },
        distinct: ['type'],
    })

    const products = await Promise.all(
        types.map(async (type) => {
            return prisma.product.findMany({
                where: {type: type.type},
                take: 20,
            })
        })
    )

    const product = products.flat();
    return json(product)
};

export default function Index() {
    const product: Product[] = useLoaderData();
    const [pdType, setPdType] = useState("REM_VAI");
    const img = [
        "/app/IMG/RTK_00.png",
        "/app/IMG/RTK_00.png",
        "/app/IMG/RTK_00.png",
        "/app/IMG/RTK_00.png",
        "/app/IMG/RTK_00.png",
    ];
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
            <main className="min-h-screen">
                <Carousel img={img}/>
                <div className="w-4/5 border-b-4 border-solid border-teal-500 m-auto py-10">
                    <div
                        className="text-4xl before:content-[''] before:grow before:border-b-4 before:border-solid before:border-teal-500 after:content-[''] after:grow after:border-b-4 after:border-solid after:border-teal-500 flex justify-center items-center">MENU
                    </div>
                    <div className="text-white bg-[rgba(0,0,0,0.8)] border-t-2 border-solid border-teal-500 flex">
                        {MenuSP.map((sp) => (
                            <button key={sp.sp}
                                    className={`w-1/5 flex justify-center items-center p-4 ${sp.type === pdType ? 'text-teal-300 border-b-2 border-solid border-teal-500' : 'anmt hover:text-teal-300'}`}
                                    onClick={() => setPdType(sp.type)}>{sp.sp}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-5 gap-4 pt-4 overflow-auto">
                        {subMenuSP.map((pd) => (
                            <Link to={`/sp/${pd.id}`} key={pd.id} className="h-[25vw] border-2 border-solid border-teal-500 rounded">
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
                <img src="/app/IMG/RTK.png" alt="" className="w-1/12 m-auto py-10"/>
                <div className="w-4/5 border-t-4 border-solid border-teal-500 m-auto py-10 flex">
                    <p className="w-1/2 border-r-2 border-solid border-teal-500 text-lg px-4">
                        Rèm Tuấn Kiệt là cửa hàng chuyên cung cấp và thi công rèm cửa chuyên nghiệp. Chúng tôi mang
                        đến
                        nhiều mẫu
                        mã và kiểu dáng đa dạng giúp khách hàng dễ dàng lựa chọn sản phẩm phù hợp với không gian của
                        mình. Đội ngũ
                        nhân viên tận tình và chu đáo luôn sẵn sàng tư vấn và hỗ trợ bạn trong quá trình chọn rèm.
                        Rèm
                        Tuấn Kiệt
                        cam kết cung cấp sản phẩm chất lượng và dịch vụ tốt nhất.
                    </p>
                    <div className="w-1/2 border-l-2 border-solid border-teal-500 px-4">
                        <div>
                            <i className="fa-light fa-phone mx-2 text-xl"></i>
                            <Link to="tel:+86822594131" className="text-xl">0822594131</Link>
                        </div>
                        <div>
                            <i className="fa-light fa-envelope mx-2 text-xl"></i>
                            <Link to="mailto:ht26091979@gmail.com" className="text-xl">ht26091979@gmail.com</Link>
                        </div>
                        <div>
                            <i className="fa-light fa-location-dot mx-2 text-xl"></i>
                            <Link to="https://maps.app.goo.gl/A7TdvgX8upqxfVJt8" className="text-xl"> 66E Ngõ 180 Nam
                                Dư,
                                Lĩnh Nam,
                                Hoàng Mai, Hà Nội</Link>
                        </div>
                        <div>
                            <i className="fa-brands fa-square-facebook mx-2 text-xl"></i>
                            <Link to="https://www.facebook.com" className="text-xl">Rèm Tuấn Kiệt</Link>
                        </div>
                        <div>
                            <i className="fa-solid fa-square-z mx-2 text-xl"></i>
                            <Link to="https://chat.zalo.me/" className="text-xl">Trần Hưởng</Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}