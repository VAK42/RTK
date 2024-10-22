import { Link } from "@remix-run/react";

export default function LH() {
    return (
        <>
            <main className="w-4/5 min-h-screen pt-20 m-auto">
                <img src="/app/IMG/RTK.png" alt="" className="w-1/12 m-auto py-10" />
                <div className="border-y-2 border-solid border-teal-500 py-10 flex">
                    <div className="w-1/2 border-r-2 border-solid border-teal-500">
                        <div>
                            <i className="fa-light fa-phone mx-2 text-xl"></i>
                            <Link to="tel:+86822594131" className="text-xl">0822594131</Link>
                        </div>
                        <div>
                            <i className="fa-light fa-envelope mx-2 text-xl"></i>
                            <Link to="mailto:ht26091979@gmail.com" className="text-xl">ht26091979@gmail.com</Link>
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
                    <div className="w-1/2 border-l-2 border-solid border-teal-500 flex justify-center items-center flex-col">
                        <p className="text-2xl">CÔNG TY RÈM TUẤN KIỆT</p>
                        <div>
                            <i className="fa-light fa-location-dot mx-2 text-2xl"></i>
                            <Link to="https://maps.app.goo.gl/A7TdvgX8upqxfVJt8" className="text-2xl"> 66E Ngõ 180 Nam Dư, Lĩnh Nam, Hoàng Mai, Hà Nội</Link>
                        </div>
                    </div>
                </div>
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d50604.2354145895!2d105.854969510951!3d20.973982139846367!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135afbb0e727c55%3A0x86a4acf44c5afbd0!2zUsOobSBD4butYSBUdeG6pW4gS2nhu4d0!5e1!3m2!1svi!2s!4v1728810361659!5m2!1svi!2s" className="w-full border-none"></iframe>
            </main>
        </>
    )
}