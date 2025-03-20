import { Link } from "@remix-run/react";

export default function LH() {
  const lh = [
    {
      icon: "fa-light fa-phone",
      link: "tel:+86822594131",
      text: "0822594131",
    },
    {
      icon: "fa-light fa-envelope",
      link: "mailto:ht26091979@gmail.com",
      text: "ht26091979@gmail.com",
    },
    {
      icon: "fa-brands fa-square-facebook",
      link: "https://www.facebook.com",
      text: "Rèm Tuấn Kiệt",
    },
    {
      icon: "fa-solid fa-square-z",
      link: "https://chat.zalo.me/",
      text: "Trần Hưởng",
    },
  ];
  return (
    <main className="w-4/5 min-h-screen pt-12 m-auto">
      <img
        src="/app/IMG/RTK.png"
        alt="RTK"
        className="w-1/12 py-10 m-auto"
        loading="lazy"
      />
      <section className="border-y-2 border-teal-500 py-10 flex">
        <section className="w-1/2 border-r border-teal-500">
          <address className="space-y-2">
            {lh.map((ct) => (
              <div key={ct.text} className="flex items-center">
                <i className={`${ct.icon} mx-2 text-xl`} />
                <Link to={ct.link} className="text-xl">
                  {ct.text}
                </Link>
              </div>
            ))}
          </address>
        </section>
        <section className="w-1/2 border-l border-teal-500 flex justify-center items-center flex-col">
          <p className="text-2xl">CÔNG TY RÈM TUẤN KIỆT</p>
          <div className="mt-4 flex items-center">
            <i className="fa-light fa-location-dot text-xl mx-2"></i>
            <Link
              to="https://maps.app.goo.gl/A7TdvgX8upqxfVJt8"
              rel="noopener noreferrer"
              target="_blank"
              className="text-xl"
            >
              66E Ngõ 180 Nam Dư, Lĩnh Nam, Hoàng Mai, Hà Nội
            </Link>
          </div>
        </section>
      </section>
      <section>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d50604.2354145895!2d105.854969510951!3d20.973982139846367!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135afbb0e727c55%3A0x86a4acf44c5afbd0!2zUsOobSBD4butYSBUdeG6pW4gS2nhu4d0!5e1!3m2!1svi!2s!4v1728810361659!5m2!1svi!2s"
          className="w-full border-none"
          loading="lazy"
        ></iframe>
      </section>
    </main>
  )
}