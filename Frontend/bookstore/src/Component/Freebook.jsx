import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Freebook = () => {
  const [book, setBook] = useState([]);

  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get('http://localhost:4001/book');
        const xx = res.data.filter((data) => data.category === "Free");
        setBook(xx);
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,  // Default for mobile
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,  // Show 3 cards on large screens
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,  // Show 2 cards on tablets
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,  // Show 1 card on mobile
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className='max-w-screen-2xl container mx-auto'>
      <h1 className='mt-5 font-semibold text-xl pb-2'>Free offered courses</h1>
      <Slider {...settings}>
        {book.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-xl">
            <figure>
              <img src={item.image} alt="Book Cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>
              <p>Genre: {item.title}</p>
              <p>Author: {item.author}</p>
              <div className="card-actions justify-between">
                <div>${item.price}</div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Freebook;
