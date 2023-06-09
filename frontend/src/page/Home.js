import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CardFeature from "../component/CardFeature";
import HomeCard from "../component/HomeCard";
import { GrPrevious, GrNext } from "react-icons/gr";
import FilterProduct from "../component/FilterProduct";
import AllProduct from "../component/AllProduct";
import { useDispatch } from "react-redux";
import { loginRedux } from "../redux/userSlice";
import "./home.css"


const Home = () => {
  const productData = useSelector((state) => state.product.productList);
  const homeProductCartList = productData.slice(1, 5);
  
  const homeProductCartListVegetables = productData.filter(
    (el) => 
    []
  );
  const loadingArray = new Array(4).fill(null);
  const loadingArrayFeature = new Array(10).fill(null);
  const userData = useSelector((state) => state.user);

  console.log("print", userData.email)

  const slideProductRef = useRef();
  const nextProduct = () => {
    slideProductRef.current.scrollLeft += 100;
  };
  const preveProduct = () => {
    slideProductRef.current.scrollLeft -= 100;
  };


  return (
    <div  className="home">
  
     <div className="p-2 md:p-4">
      <div className="md:flex gap-4 py-2">
        <div className="md:w-1/2">
          <h2 className="text-black md:text-7xl font-bold py-3">
             Welcome to {" "}
            <span className="text-blue-600 text-">Paperback Mine</span>
          </h2>
          <p className="py-3 text-black font-family: Times New Roman">
            Our book store is more than just a place to buy books. It's a community 
            of book lovers who share a passion for reading and learning. That's why 
            we're committed to curating a diverse selection of books that can speak
            to everyone. Whether you're looking for entertainment or enlightenment,
            we've got you covered. 
          </p>
        </div>

      
      </div>
  
      <div className="">
        <div className="flex w-full items-center">
          <h2 className="font-bold text-2xl text-slate-800 mb-4 text-black">
             Recommended Books
          </h2>
          <div className="ml-auto flex gap-4">
            <button
              onClick={preveProduct}
              className="bg-slate-300 hover:bg-slate-400 text-lg  p-1 rounded"
            >
              <GrPrevious />
            </button>
            <button
              onClick={nextProduct}
              className="bg-slate-300 hover:bg-slate-400 text-lg p-1 rounded "
            >
              <GrNext />
            </button>
          </div>
        </div>
        <div
          className="flex gap-5 overflow-scroll scrollbar-none scroll-smooth transition-all"
          ref={slideProductRef}
        >
          {homeProductCartListVegetables[0]
            ? homeProductCartListVegetables.map((el) => {
                return (
                  <CardFeature
                    key={el._id}
                    id={el._id}
                    name={el.name}
                    category={el.category}
                    price={el.price}
                    image={el.image}
                  />
                );
              })
            : loadingArrayFeature.map((el,index) => (
                <CardFeature loading="Loading..." key={index+"cartLoading"} />
              ))}
        </div>
      </div>
      </div>
      </div>
  
  );
};

export default Home;
