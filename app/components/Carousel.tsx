import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface CarouselProps {
    img: string[];
}

const Carousel: React.FC<CarouselProps> = ({ img }) => {
    return (
        <Swiper
            centeredSlides={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="Carousel"
        >
            {img.map((image, index) => (
                <SwiperSlide key={index}>
                    <img src={image} alt={`Slide ${index + 1}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default Carousel