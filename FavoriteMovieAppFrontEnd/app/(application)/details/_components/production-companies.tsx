import React from "react";
import { ProductionCompany } from "@/types";
import Image from "next/image";
import { tmdbImageUrl } from "@/lib/constants";
import HoverLabel from "@/components/hover-label";

type Props = {
  productionCompanies: ProductionCompany[];
};

const ProductionCompanies = ({ productionCompanies }: Props) => {
  return (
    <div className="flex  gap-3 items-center flex-wrap">
      {productionCompanies.map((company) => (
        <div key={company.id}>
          {company.logo_path && (
            <HoverLabel label={company.name}>
              <div className="bg-gray-200  p-2 w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <Image
                  src={`${tmdbImageUrl}/${company.logo_path}`}
                  alt="logo"
                  width={100}
                  height={100}
                  className="rounded-full aspect-square object-contain"
                />
              </div>
            </HoverLabel>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductionCompanies;
