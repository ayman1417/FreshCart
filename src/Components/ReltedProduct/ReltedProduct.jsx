import React from 'react'
import Slider from "react-slick";
import Product from '../../Components/Product/Product';


export default function ReltedProduct({ reltedProduct }) {



    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div>
            <div className="slider-container w-[95%] p-10 mx-auto">
            <style jsx>{`
                           .slick-prev:before, .slick-next:before {
                font-family: 'slick';
                font-size: 30px;
                line-height: 2;
                opacity: .75;
                color: black;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
                        `}</style>
                <Slider {...settings} >

                    {reltedProduct?.map((product, index) => (
                        <Product key={index} product={product} />
                    ))}
                </Slider>

            </div>
        </div>
    )
}
