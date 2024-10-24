import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";

export default function Header() {
    const MenuSP = [
        { sp: "Rèm Vải", url: "/sp?type=REM_VAI" },
        { sp: "Rèm Cầu Vồng", url: "/sp?type=REM_CAU_VONG" },
        { sp: "Rèm Gỗ", url: "/sp?type=REM_GO" },
        { sp: "Rèm Cuốn", url: "/sp?type=REM_CUON" },
        { sp: "Rèm Lá Lật", url: "/sp?type=REM_LA_LAT" },
        { sp: "Rèm Khác", url: "/sp?type=KHAC" },
    ];
    const [sMenuSP, setSMenuSP] = useState(false);
    const lct = useLocation();
    return (
        <>
            <header className="w-full h-20 text-white bg-[rgba(0,0,0,0.8)] flex fixed z-50">
                <div className="w-1/5 h-full flex justify-center items-center">
                    <img src="/app/IMG/RTK.png" alt="RTK" className="max-h-full" />
                </div>
                <div className="w-4/5 h-full flex">
                    <Link
                        to="/"
                        className={`w-1/4 h-full flex justify-center items-center ${lct.pathname === "/"
                            ? "text-teal-300 border-b-2 border-solid border-teal-300"
                            : "hover:text-teal-300 anmt"
                            }`}
                    >
                        <i className="fa-light fa-house m-2"></i>
                        TRANG CHỦ
                    </Link>
                    <div
                        className={`w-1/4 h-full hover:cursor-pointer ${lct.pathname === "/sp"
                            ? "text-teal-300 border-b-2 border-solid border-teal-300"
                            : "hover:text-teal-300"
                            }`}
                        onMouseEnter={() => setSMenuSP(true)}
                        onMouseLeave={() => setSMenuSP(false)}
                    >
                        <Link
                            to="/sp"
                            className="h-full flex justify-center items-center anmt"
                        >
                            <i className="fa-light fa-box-archive m-2"></i>
                            SẢN PHẨM
                            <i className="fa-light fa-angle-down m-2"></i>
                        </Link>
                        {sMenuSP && (
                            <ul className="text-white bg-[rgba(0,0,0,0.8)] border-b-2 border-solid border-teal-300">
                                {MenuSP.map((sp) => (
                                    <Link
                                        to={sp.url}
                                        key={sp.sp}
                                        className="block hover:text-teal-300 hover:cursor-pointer anmt"
                                        onMouseEnter={(e) => e.stopPropagation()}
                                    >
                                        <i className="fa-light fa-arrow-right m-2"></i>
                                        {sp.sp}
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Link
                        to="/gt"
                        className={`w-1/4 h-full flex justify-center items-center ${lct.pathname === "/gt"
                            ? "text-teal-300 border-b-2 border-solid border-teal-300"
                            : "hover:text-teal-300 anmt"
                            }`}
                    >
                        <i className="fa-light fa-align-justify m-2"></i>
                        GIỚI THIỆU
                    </Link>
                    <Link
                        to="/lh"
                        className={`w-1/4 h-full flex justify-center items-center ${lct.pathname === "/lh"
                            ? "text-teal-300 border-b-2 border-solid border-teal-300"
                            : "hover:text-teal-300 anmt"
                            }`}
                    >
                        <i className="fa-light fa-user m-2"></i>
                        LIÊN HỆ
                    </Link>
                </div>
            </header>
        </>
    )
}