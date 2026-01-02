import type { SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";

const ACADEMIC_YEARS_QUERY = `*[_type == "academicYear"]{
  _id,
  title,
  year,
  "dcetRankers": *[
    _type == "dcetStudent" &&
    references(^._id)
  ] | order(rank asc) {
    _id,
    name,
    rank,
    college,
    "avatar": avatar.asset->url
  }
}`;

const options = { next: {} };

export async function DCETRankers() {
  const academicYears = await client.fetch<
    SanityDocument<{
      title: string;
      year: number;
      dcetRankers: SanityDocument<{
        name: string;
        rank: number;
        college: string;
        avatar: string;
      }>[];
    }>[]
  >(ACADEMIC_YEARS_QUERY, {}, options);

  console.log(academicYears);

  return (
    <section className="flex flex-col items-center gap-24 py-20">
      {academicYears.map((year) => (
        <div
          key={year._id}
          className="flex w-full max-w-7xl flex-col items-center gap-14 px-6"
        >
          {/* Academic Year Header */}
          <div className="text-center">
            <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
              Academic Year
            </h3>
            <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">
              DCET Rankers – {year.title}
            </h2>
          </div>

          {/* Rankers Grid */}
          <div className="grid w-full grid-cols-2 gap-8 lg:grid-cols-5">
            {year.dcetRankers.map((mem, index) => {
              const rank = index + 1;

              const rankBadgeStyle =
                rank === 1
                  ? "bg-gradient-to-r from-amber-600 to-orange-700 text-white"
                  : rank === 2
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                    : rank === 3
                      ? "bg-gradient-to-r from-gray-300 to-gray-400 text-black"
                      : "bg-muted text-muted-foreground border-2";

              return (
                <div
                  key={mem._id}
                  className="bg-background group relative flex flex-col items-center gap-4 rounded-2xl border p-1 py-5 text-center shadow-sm transition-all"
                >
                  {/* Rank Badge */}
                  <span
                    className={`absolute -top-4 rounded-full px-3 py-1 font-mono font-bold ${rankBadgeStyle}`}
                  >
                    {mem.rank}
                  </span>

                  {/* Avatar */}
                  <Avatar className="size-28 border">
                    <AvatarImage src={mem.avatar} className="object-cover" />
                    <AvatarFallback>
                      <span className="text-muted-foreground text-4xl font-bold">
                        {mem.name.charAt(0)}
                      </span>
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & College */}
                  <div className="space-y-1">
                    <p className="text-base font-semibold leading-tight">
                      {mem.name}
                    </p>
                    <span className="text-muted-foreground text-xs">
                      {mem.college}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
