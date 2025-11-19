import Image from "next/image";
import Slider from "@/components/main/slider";
import Menu from "@/components/main/menu";

// Example icon import (replace with your actual icon)
import { FaUser } from "react-icons/fa";
const UserIcon = FaUser;

export default function Home() {
  return (
    <>
      <div className="overflow-x-hidden max-w-full flex items-center gap-4 px-4 border-b border-gray overflow-x-hidden">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex overflow-hidden cursor pointer rounded-full bg-[#8A38F5] w-12 h-12">
            <UserIcon className="text-white w-6 h-6 m-auto" />
          </div>
          <div className="overflow-x-hidden flex flex-col justify-center mx-md py-8">
            <h1 className="text-xl">
              Olá,{" "}
              <span className="font-semibold">
                Daniele!
              </span>
            </h1>
            <span className="overflow-x-hidden text-sm font-semibold text-[#8A38F5] ">
              Por onde quer começar hoje?
            </span>
          </div>
          <Menu className="" />
        </div>
      </div>
      <div className="max-w-full border-b border-gray overflow-h-hidden overflow-x-hidden">
        <Slider />
      </div>
    </>
  );
}
