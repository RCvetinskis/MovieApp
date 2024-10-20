import { ProductionCountry } from "@/types";
import Flag from "react-world-flags";

type Props = {
  countries: ProductionCountry[];
};

const ProductionCountries = ({ countries }: Props) => {
  return (
    <div className="flex  gap-3 flex-wrap items-center">
      {countries.map((country, i) => (
        <Flag width={34} height={34} code={country.iso_3166_1} key={i} />
      ))}
    </div>
  );
};
export default ProductionCountries;
