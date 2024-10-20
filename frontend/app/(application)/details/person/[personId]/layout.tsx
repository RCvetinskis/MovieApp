import { getPersonById } from "@/actions/tmdb api/getRequests";
import { IPerson } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { tmdbImageUrl } from "@/lib/constants";
import RatingComponent from "@/components/rating-component";
import KnownForCarousel from "./_components/known-for-carousel";

type Props = {
  children: React.ReactNode;
  params: {
    personId?: string;
  };
};

const PersonIdLayout = async ({ children, params }: Props) => {
  const personId = params.personId;

  if (!personId) return <div>Page not found!</div>;

  const person: IPerson = await getPersonById(personId);
  if (!person) return <div>Person not found!</div>;

  const image = person.profile_path
    ? `${tmdbImageUrl}/${person.profile_path}`
    : "/assets/no_image.jpg";
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <Image
            src={image}
            alt={person.name}
            width={350}
            height={350}
            className="rounded-lg"
          />

          <div className="sm:ml-6 mt-4 sm:mt-0">
            <CardTitle className="text-4xl font-bold">{person.name}</CardTitle>
            {person.place_of_birth && (
              <CardDescription className="text-lg text-muted-foreground">
                Place of Birth: {person.place_of_birth}
              </CardDescription>
            )}
            {person.birthday && (
              <CardDescription className="text-lg text-muted-foreground">
                Birthday: {new Date(person.birthday).toLocaleDateString()}
              </CardDescription>
            )}
            {person.deathday && (
              <CardDescription className="text-lg text-muted-foreground">
                Deathday: {new Date(person.deathday).toLocaleDateString()}
              </CardDescription>
            )}

            <div className="flex items-center text-lg text-muted-foreground">
              <span> Popularity:</span>
              <RatingComponent rating={person.popularity} />
            </div>
            {person.also_known_as?.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Also Known As:</h3>
                <ul className="list-disc list-inside">
                  {person.also_known_as.map((alias) => (
                    <li key={alias}>{alias}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Biography</h2>
        <p className="text-muted-foreground/80  whitespace-pre-line">
          {person.biography}
        </p>
      </CardContent>

      <Separator />
      {children}
    </Card>
  );
};

export default PersonIdLayout;
