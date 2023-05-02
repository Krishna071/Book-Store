import React from "react";
import { FcReading} from "react-icons/fc";

const FilterProduct = ({category,onClick,isActive}) => {
  return (
    <div onClick={onClick}>
      <div className={`text-3xl p-5  rounded-full cursor-pointer ${isActive ? "bg-red-600 text-grey" : "bg-grey-500"}`}>
        <FcReading />
      </div>
      <p className="text-center font-medium my-1 capitalize">{category}</p>
    </div>
  );
};

export default FilterProduct;
